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

-   **Backend:** A Spring Boot 4.1 (Java 21) application that provides a REST API for saving and loading pixel art. It uses MongoDB for data persistence.
-   **Frontend:** An Angular 22 single-page application (SPA, prerendered with Angular SSR) that provides the user interface for drawing and managing pixel art. It communicates with the backend via the REST API.

### REST API

| Method | Path                   | Description                                      |
| ------ | ---------------------- | ------------------------------------------------ |
| GET    | `/api/pixel-art`       | List all saved pixel art.                        |
| GET    | `/api/pixel-art/{id}`  | Get one pixel art (404 if it does not exist).    |
| POST   | `/api/pixel-art`       | Create a new pixel art (201 + `Location`).       |
| PUT    | `/api/pixel-art/{id}`  | Update an existing pixel art (404 if missing).   |

Request body: `{"name": "...", "pixels": [["#RRGGBB", ...], ...]}`. The name is required (max. 100 characters) and `pixels` must be a rectangular matrix of `#RRGGBB` colors, at most 128×128. Errors are returned as [RFC 9457 problem details](https://www.rfc-editor.org/rfc/rfc9457).

## Getting Started

### Prerequisites

- Java 21 or later
- Maven 3.9+
- Node.js 22.22+ or 24.15+ and npm
- A running MongoDB instance (default: `mongodb://localhost:27017/squaresketcher`)

### Configuration

The backend reads the following environment variables:

| Variable               | Default                                     | Description                                                             |
| ---------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `MONGODB_URI`          | `mongodb://localhost:27017/squaresketcher`  | MongoDB connection string.                                              |
| `CORS_ALLOWED_ORIGINS` | *(empty, CORS disabled)*                    | Comma-separated origins allowed to call the API from another domain.    |

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Build and run the tests:**
    ```bash
    mvn verify
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
    npm ci
    ```
3.  **Run the application:**
    ```bash
    npm start
    ```
    The frontend will be running on `http://localhost:4200`. Requests to `/api` are proxied to the backend on port 8080.
4.  **Run the tests / build for production:**
    ```bash
    npm test -- --watch=false
    npm run build
    ```

## Continuous Integration

-   `.github/workflows/ci.yml` builds and tests the backend and the frontend on every push and pull request.
-   `.github/workflows/deploy-frontend.yml` publishes the frontend to GitHub Pages on every push to `main`. The Pages build only contains the frontend; saving and loading needs a reachable backend.

## License

This project is licensed under the Creative Commons License.
