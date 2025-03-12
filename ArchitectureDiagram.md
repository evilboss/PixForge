## 📊 Architecture Diagram

```mermaid
flowchart TD
    subgraph API Gateway
        A[API Gateway] -->|Routes Requests| B(Image Processing Service)
        A -->|Routes Requests| C(Image Cropping Service)
    end

    subgraph Microservices
        B -->|Uses| D[Shared Library]
        C -->|Uses| D[Shared Library]
    end

    subgraph CDN & Storage
        E[CDN/Storage] -.->|Sends Processed Images| B
        E -.->|Sends Cropped Images| C
    end

    subgraph External Clients
        F[CMS System] -->|Uploads Images| A
        G[Casino Platform] -->|Uses Processed Images| E
    end
