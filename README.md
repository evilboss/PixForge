# PixForge

#### Image Processing Service for CMS Integration

## 📌 Overview

The **Image Processing Service** is designed to process and optimize images uploaded to the CMS in a **casino platform
**. It converts images to **WebP format**, generates variations based on predefined types, and provides a **cropping
endpoint**. The service is built as a **NestJS microservice** and is designed for scalability and high-performance image
processing.

## 🚀 Features

### 🖼 Image Upload Processing

- Convert uploaded images to **WebP format** if not already in WebP.
- Generate variations based on image type:
    - **Game Images:** Create a **thumbnail (184x256)** with the original filename.
    - **Promotion Images:** Create a **resized version (361x240)**.
- Use **configurable settings** to define sizes and variations.

### ✂️ Image Cropping Endpoint

- Accepts:
    - Image file
    - Crop options:
        - `x, y` (coordinates of the crop's top-left corner)
        - `width, height` (crop dimensions)
        - `outputFormat` (optional, default: WebP)
- Returns the **cropped image**.

### 🔑 API Key Security & Validation

- Uses **API_KEY** for authentication.
- Requests must include **x-api-key** in headers.
- Requests are **validated automatically** using a NestJS guard.
- If `API_KEY` is **not set**, the service allows all requests.

### ⚡ Microservices Architecture

- Built using **NestJS Monorepo** with shared modules.
- Services:
    - **API Gateway**: Routes requests to microservices.
    - **Image Processing Service**: Handles image uploads, conversions, and variations.
    - **Image Cropping Service**: Provides a cropping API.
- Uses **Shared Library (`libs/shared-storage`)** for common utilities.

### 🌍 Flexible Deployment Modes

- **Internal Mode** (`docker-compose.yml`): Services communicate within a private network.
- **Exposed Mode** (`docker-compose.exposed.yml`): Services are publicly accessible.

---

## 📂 Folder Structure

```
apps/
 ├── api-gateway/         # API Gateway
 │    ├── src/
 │    ├── main.ts         # Entry point
 │    ├── ...
 ├── image-processing/    # Image processing microservice
 │    ├── src/
 │    ├── main.ts
 │    ├── ...
 ├── cropping/            # Cropping microservice
 │    ├── src/
 │    ├── main.ts
 │    ├── ...

libs/
 ├── shared-storage/      # Shared utilities
 │    ├── src/
 │    ├── index.ts
 │    ├── ...
```

---

## 🔧 Installation & Setup

### 1️⃣ Install Dependencies

```sh
yarn install
```

### 2️⃣ Generate API Key

```sh
yarn generate:key
```

This **generates or updates** `API_KEY` in `.env`.

### 3️⃣ Run Locally

Run individual services:

```sh
yarn local:api-gateway
```

```sh
yarn local:image-processing
```

```sh
yarn local:cropping
```

---

## 📦 Docker Deployment

### 🚀 Default (Internal Mode)

```sh
yarn docker:start-dev
```

- Uses `docker-compose.yml`
- Services communicate internally, **not exposed to public**.

### 🌍 Exposed Mode

```sh
yarn docker:start-dev --exposed
```

- Uses `docker-compose.exposed.yml`
- Services are **publicly accessible**.

### 📜 View Logs

```sh
docker-compose logs -f
```

### 🛑 Stop Services

```sh
yarn docker:down
```

---

## 🔍 API Endpoints

### 🔑 Health Check

```sh
curl -X GET http://localhost:4005/health
```

### 🖼 Process Image

```sh
curl -X POST http://localhost:4005/process-image \
     -H "x-api-key: YOUR_SECRET_KEY" \
     -F "file=@image.jpg" \
     -F "imageType=game"
```

### ✂️ Crop Image

```sh
curl -X POST http://localhost:4005/crop-image \
     -H "x-api-key: YOUR_SECRET_KEY" \
     -F "file=@image.jpg" \
     -F "x=10" -F "y=10" \
     -F "width=200" -F "height=200"
```

---

### ✅ Testing

```sh
yarn test
```

```sh
yarn test:watch
```

---

## 🏆 Acceptance Criteria

✅ Images are processed into **WebP format** and **resized correctly**.  
✅ Cropping works with **custom dimensions**.  
✅ API **requires authentication** if `API_KEY` is set.  
✅ Service scales efficiently under **high traffic**.  
✅ Easy configuration for **new image types**.

---

## 🚦CI/CD Pipeline (GitHub Actions)

This project uses **GitHub Actions** for:
✅ Automatic builds  
✅ Linting & testing  
✅ Docker image deployment

Check latest builds: **[GitHub Actions](https://github.com/evilboss/PixForge/actions)**

## 📝Issue tracking

This project follows a structured issue tracking process using GitHub Issues. Every feature, enhancement, and bug fix
has been documented through issues to maintain transparency and organization.

For historical and managerial purposes, we encourage reviewing closed issues to understand the development journey, past
challenges, and implemented solutions.

📌 View Closed Issues: [GitHub Issue History](https://github.com/evilboss/PixForge/issues?q=is%3Aissue%20state%3Aclosed)

### Architecture Diagram

Please refer to the **[Architecture Diagram](ArchitectureDiagram.md)** for a visual representation of the service's
architecture.

**Jr Reyes**  
✉️ [jr.evilboss@gmail.com](mailto:jr.evilboss@gmail.com)
