#!/bin/bash

# Enhanced Development Environment Startup Script
# This script sets up the complete development environment with database and application

set -e  # Exit on any error
trap 'echo "❌ Script interrupted. Cleaning up..."; cleanup; exit 1' INT TERM

# Configuration
DB_SERVICE="db"
MAX_WAIT_TIME=30  # Reduced from 60 for faster failure
WAIT_INTERVAL=2   # seconds
REQUIRED_TOOLS=("docker" "docker-compose" "npm" "node")
DEBUG=${DEBUG:-false}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Cleanup function
cleanup() {
    log_info "Stopping database container..."
    docker compose down >/dev/null 2>&1 || true
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    local missing_tools=()

    for tool in "${REQUIRED_TOOLS[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done

    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_info "Please install missing tools and try again."
        exit 1
    fi

    log_success "All dependencies are available."
}

# Check if Docker daemon is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon is not running."
        log_info "Please start Docker and try again."
        exit 1
    fi
}

# Start database and wait for it to be ready
start_database() {
    log_info "Starting PostgreSQL database..."

    # Start the database service
    if ! docker compose up -d "$DB_SERVICE" >/dev/null 2>&1; then
        log_error "Failed to start database service."
        exit 1
    fi

    # Get container name
    CONTAINER_NAME=$(docker compose ps --format "{{.Names}}" "$DB_SERVICE" 2>/dev/null)
    if [ -z "$CONTAINER_NAME" ]; then
        log_error "Could not find database container."
        exit 1
    fi

    # Check if container is actually running
    if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_error "Database container is not running."
        log_info "Container status: $(docker ps -a --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null || echo 'Container not found')"
        exit 1
    fi

    log_info "Database container: $CONTAINER_NAME"

    # Load database credentials from .env
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs 2>/dev/null)
    fi

    local db_user=${POSTGRES_USER:-roshan}
    local db_name=${POSTGRES_DB:-tempDB}

    # Wait for database to be ready
    log_info "Waiting for database to be ready (max ${MAX_WAIT_TIME}s)..."
    local waited=0

    while [ $waited -lt $MAX_WAIT_TIME ]; do
        if [ "$DEBUG" = "true" ]; then
            log_info "Checking database readiness (attempt $((waited / WAIT_INTERVAL + 1)))..."
        fi

        if docker exec "$CONTAINER_NAME" pg_isready -U "$db_user" -d "$db_name" >/dev/null 2>&1; then
            log_success "Database is ready! (${waited}s)"
            return 0
        fi

        echo -n "."
        sleep $WAIT_INTERVAL
        waited=$((waited + WAIT_INTERVAL))
    done

    log_error "Database failed to start within ${MAX_WAIT_TIME} seconds."
    log_info "Check database logs: docker compose logs $DB_SERVICE"
    log_info "Container status: $(docker ps --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null || echo 'Container not found')"
    exit 1
}

# Display database information
show_database_info() {
    # Load database credentials from .env
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs 2>/dev/null)
    fi

    local db_user=${POSTGRES_USER:-roshan}
    local db_name=${POSTGRES_DB:-tempDB}
    local db_password=${POSTGRES_PASSWORD:-Test@1234}

    echo ""
    log_info "Database Information:"
    echo "  Container: $CONTAINER_NAME"
    echo "  Database: $db_name"
    echo "  User: $db_user"
    echo "  Connection: postgresql://$db_user:$db_password@localhost:5432/$db_name"
    echo ""
}

# Check if application port is available
check_port() {
    local port=${PORT:-2912}
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port $port is already in use."
        log_info "The application may fail to start. Please free the port or change PORT in .env"
    fi
}

# Start the application
start_application() {
    log_info "Starting development server..."

    # Check if port is available
    check_port

    # Start the application with nodemon
    log_info "Running: ./node_modules/.bin/nodemon src/index.ts"
    echo ""
    exec ./node_modules/.bin/nodemon src/index.ts
}

# Main execution
main() {
    echo ""
    log_info "🚀 Initializing Start Script"
    echo "=========================================="

    check_dependencies
    check_docker
    start_database
    show_database_info
    start_application
}

# Run main function
main "$@"
