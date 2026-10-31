# SquareSketcher

[![Framework: Angular](https://img.shields.io/badge/Framework-Angular-red)](https://angular.io/)
[![Backend: Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-green)](https://spring.io/projects/spring-boot)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![License: CC](https://img.shields.io/badge/License-Creative_Commons-blue)](LINK_TO_YOUR_LICENSE_PAGE)

Create and save your pixel art with ease!

## Overview

SquareSketcher is a full-stack web application that allows users to craft pixel art images and save them for later use. Whether you're a professional designer or just someone who enjoys pixel art, SquareSketcher offers a straightforward platform to unleash your creativity.

This repository contains both the frontend (Angular) and backend (Spring Boot) implementations.

## Features

- Intuitive pixel canvas to draw on.
- Wide range of color selections.
- Save and load pixel art projects.
- Responsive design: create pixel art on any device.

## Architecture

The application is divided into two main parts:

-   **Backend:** A Spring Boot application that provides a REST API for saving and loading pixel art. It uses MongoDB for data persistence.
-   **Frontend:** An Angular single-page application (SPA) that provides the user interface for drawing and managing pixel art. It communicates with the backend via the REST API.

## Getting Started

### Prerequisites

- Java 17 or later
- Maven
- Node.js and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    mvn install
    ```
3.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    The backend will be running on `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    ng serve
    ```
    The frontend will be running on `http://localhost:4200`.

## License

This project is licensed under the Creative Commons License.
