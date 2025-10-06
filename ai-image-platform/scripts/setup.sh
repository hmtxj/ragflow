#!/bin/bash

# AI Image Platform - Quick Setup Script
# This script helps you set up the development environment quickly

set -e

echo "🚀 AI Image Platform - Quick Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "\n${BLUE}[STEP]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_step "Checking requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "All requirements satisfied ✓"
}

# Setup environment file
setup_environment() {
    print_step "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_status "Environment file created ✓"
        print_warning "Please review and update .env file with your configuration"
    else
        print_status "Environment file already exists ✓"
    fi
}

# Main execution
main() {
    check_requirements
    setup_environment
    
    print_step "🎉 Setup completed!"
    echo
    echo "Next steps:"
    echo "1. Review and update .env file"
    echo "2. Run: make build && make up"
    echo "3. Run: make migrate"
    echo "4. Run: make superuser (optional)"
    echo
    echo "Or use Docker Compose directly:"
    echo "  docker-compose up --build -d"
    echo
}

# Run main function
main "$@"