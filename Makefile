# Makefile for Sentiment Analysis Launcher

CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -Wextra
TARGET = sentiment-launcher
SOURCE = launcher.cpp

# Windows specific flags
ifeq ($(OS),Windows_NT)
    TARGET := $(TARGET).exe
    CXXFLAGS += -static-libgcc -static-libstdc++
endif

# Default target
all: $(TARGET)

# Build the executable
$(TARGET): $(SOURCE)
	@echo "Compiling $(SOURCE)..."
	$(CXX) $(CXXFLAGS) $(SOURCE) -o $(TARGET)
	@echo "✅ Build complete: $(TARGET)"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
ifeq ($(OS),Windows_NT)
	del /f $(TARGET) 2>nul || true
else
	rm -f $(TARGET)
endif
	@echo "✅ Clean complete"

# Install dependencies info
deps:
	@echo "Required dependencies:"
	@echo "- g++ compiler (MinGW-w64 on Windows)"
	@echo "- Docker Desktop"
	@echo "- Docker Compose"
	@echo ""
	@echo "Install MinGW-w64:"
	@echo "  Windows: winget install mingw"
	@echo "  Or download from: https://www.mingw-w64.org/downloads/"

# Help target
help:
	@echo "Available targets:"
	@echo "  all     - Build the launcher executable"
	@echo "  clean   - Remove build artifacts"
	@echo "  deps    - Show dependency information"
	@echo "  help    - Show this help message"

.PHONY: all clean deps help