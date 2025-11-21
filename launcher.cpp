#include <iostream>
#include <string>
#include <cstdlib>
#include <windows.h>
#include <thread>
#include <chrono>

class DockerLauncher {
private:
    const std::string DOCKER_PATH = "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe";
    const int MAX_WAIT_SECONDS = 60;
    
    void printHeader() {
        system("cls");
        std::cout << "========================================\n";
        std::cout << "  Sentiment Analysis App - Launcher\n";
        std::cout << "========================================\n\n";
    }
    
    void printColored(const std::string& text, int color) {
        HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
        SetConsoleTextAttribute(hConsole, color);
        std::cout << text;
        SetConsoleTextAttribute(hConsole, 7); // Reset to white
    }
    
    bool isDockerRunning() {
        int result = system("docker version >nul 2>&1");
        return result == 0;
    }
    
    bool startDockerDesktop() {
        printColored("🐳 Starting Docker Desktop...\n", 11); // Cyan
        
        // Check if Docker Desktop executable exists
        DWORD fileAttr = GetFileAttributesA(DOCKER_PATH.c_str());
        if (fileAttr == INVALID_FILE_ATTRIBUTES) {
            printColored("❌ Docker Desktop not found at: " + DOCKER_PATH + "\n", 12); // Red
            std::cout << "Please install Docker Desktop or update the path in the launcher.\n";
            return false;
        }
        
        // Start Docker Desktop
        std::string command = "start \"\" \"" + DOCKER_PATH + "\"";
        system(command.c_str());
        
        std::cout << "Waiting for Docker to start";
        
        // Wait for Docker to be ready
        for (int i = 0; i < MAX_WAIT_SECONDS; i++) {
            std::cout << ".";
            std::cout.flush();
            std::this_thread::sleep_for(std::chrono::seconds(1));
            
            if (isDockerRunning()) {
                std::cout << "\n";
                printColored("✅ Docker is ready!\n", 10); // Green
                return true;
            }
        }
        
        std::cout << "\n";
        printColored("⚠️  Docker took too long to start. Please wait a moment and try again.\n", 14); // Yellow
        return false;
    }
    
    bool checkDocker() {
        std::cout << "Checking Docker status...\n";
        
        if (isDockerRunning()) {
            printColored("✅ Docker is already running\n", 10); // Green
            return true;
        }
        
        printColored("⚠️  Docker is not running\n", 14); // Yellow
        return startDockerDesktop();
    }
    
    bool checkDockerCompose() {
        std::cout << "Checking Docker Compose...\n";
        int result = system("docker-compose version >nul 2>&1");
        if (result != 0) {
            printColored("❌ Docker Compose is not available!\n", 12); // Red
            printColored("Please install Docker Compose and try again.\n", 14); // Yellow
            return false;
        }
        printColored("✅ Docker Compose is available\n", 10); // Green
        return true;
    }
    
    void startApplication() {
        std::cout << "\n";
        printColored("🚀 Starting Sentiment Analysis Application...\n", 11); // Cyan
        std::cout << "\nThis will:\n";
        std::cout << "  - Start Redis database\n";
        std::cout << "  - Build and start Backend API (port 8000)\n";
        std::cout << "  - Build and start Frontend (port 3000)\n\n";
        printColored("⏱️  First startup may take 2-3 minutes to download ML models (~1GB)\n\n", 14); // Yellow
        
        std::cout << "Starting services...\n";
        int result = system("docker-compose up --build");
        
        if (result == 0) {
            std::cout << "\n";
            printColored("🎉 Application started successfully!\n", 10); // Green
            std::cout << "\n";
            printColored("📱 Frontend: http://localhost:3000\n", 11); // Cyan
            printColored("🔧 Backend API: http://localhost:8000\n", 11); // Cyan
            printColored("📚 API Docs: http://localhost:8000/docs\n", 11); // Cyan
        }
    }
    
    void stopApplication() {
        std::cout << "\n";
        printColored("🛑 Stopping Sentiment Analysis Application...\n", 14); // Yellow
        std::cout << "\n";
        
        int result = system("docker-compose down");
        
        if (result == 0) {
            std::cout << "\n";
            printColored("✅ Application stopped successfully!\n", 10); // Green
            std::cout << "All containers have been stopped and removed.\n";
        }
    }
    
public:
    void run() {
        printHeader();
        
        if (!checkDocker() || !checkDockerCompose()) {
            std::cout << "\nPress Enter to exit...";
            std::cin.get();
            return;
        }
        
        std::cout << "\nChoose an option:\n";
        std::cout << "1. Start Application\n";
        std::cout << "2. Stop Application\n";
        std::cout << "3. Exit\n";
        std::cout << "\nEnter your choice (1-3): ";
        
        int choice;
        std::cin >> choice;
        
        switch (choice) {
            case 1:
                startApplication();
                break;
            case 2:
                stopApplication();
                break;
            case 3:
                std::cout << "Goodbye!\n";
                return;
            default:
                printColored("Invalid choice. Please run the program again.\n", 12); // Red
                break;
        }
        
        std::cout << "\nPress Enter to exit...";
        std::cin.ignore();
        std::cin.get();
    }
};

int main() {
    DockerLauncher launcher;
    launcher.run();
    return 0;
}