# Trip Finder Backend

## Overview
Trip Finder is a comprehensive backend system designed to enhance the travel experience through personalized recommendations and efficient search capabilities. The system is built using a microservices architecture, consisting of the following services:
- **User Service**: Handles user authentication (login and signup), user profile management, and historical data tracking for recommendations.
- **Search Service**: Provides search functionality for hotels, attractions, restaurants, and vehicles. Utilizes Redis for caching and Elasticsearch for high performance.
- **Recommendation Service**: Offers personalized trip recommendations by analyzing user preferences and incorporating various travel factors.
- **Task Scheduler Service**: Performs periodic tasks to ensure data relevance and maintain system efficiency. 
- **Gateway Service**: Gateway for end user access to system , applying rate limiter and proxy



## Technologies Used
- Docker
- Elastic Search
- RabbitMQ
- Redis
- ExpressJS
- MongoDB


## API Endpoints
Brief overview of some key API endpoints for each service, for example:

### User Service
- `POST /signup`: Creates a new user account.
- `POST /login`: Authenticates a user and generates an access token.
- `GET /profile`: Retrieves user information by ID.

### Search Service
- `GET /hotels`: Retrieves a list of hotels based on search criteria.
- `GET /attractions`: Retrieves a list of attractions based on search criteria.
- `GET /restaurants`: Retrieves a list of restaurants based on search criteria.
- `GET /vehicles`: Retrieves a list of vehicles based on search criteria.

### Recommendation Service
- `GET /recommend`: Retrieves personalized trip recommendations for a user.

### Task Scheduler Service
Handles periodic tasks such as:

- Generating effective recommendations
- Indexing newly crawled data
- Removing outdated data
- Updating top 8 recommendations
- Automatically generating daily schedules


