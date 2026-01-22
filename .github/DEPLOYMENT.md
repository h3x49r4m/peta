Deployment Guide
================

Peta is designed as a dynamic website engine and requires a Node.js runtime environment. This guide covers various deployment options.

GitHub Actions Workflows
------------------------

The repository includes several GitHub Actions workflows for different deployment targets:

### Build and Test (build.yml)

Main workflow that:
- Builds the application
- Runs comprehensive tests
- Tests API endpoints
- Deploys to Vercel (when configured)

**Required Secrets:**
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### Deploy to Netlify (deploy-netlify.yml)

Deploys to Netlify with serverless functions support.

**Required Secrets:**
- `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
- `NETLIFY_SITE_ID`: Your Netlify site ID

### Deploy to Railway (deploy-railway.yml)

Deploys to Railway for Node.js application hosting.

**Required Secrets:**
- `RAILWAY_TOKEN`: Your Railway API token

### Lint and Test (lint-and-test.yml)

Runs code quality checks and tests on every push and pull request.

Deployment Platforms
--------------------

### Vercel (Recommended)

1. **Automatic Deployment:**
   - Configure Vercel secrets in GitHub repository settings
   - Push to main branch to trigger deployment
   - Vercel will automatically build and deploy

2. **Manual Deployment:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   cd peta
   vercel --prod
   ```

### Netlify

1. **Connect Repository:**
   - Connect your GitHub repository to Netlify
   - Set build command: `cd peta && npm run build`
   - Set publish directory: `peta`
   - Set environment variables as needed

2. **Configure Functions:**
   - Netlify will automatically detect Next.js API routes
   - Functions will be deployed as serverless functions

### Railway

1. **Deploy via CLI:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy
   railway up
   ```

2. **Deploy via GitHub:**
   - Connect your GitHub repository to Railway
   - Railway will automatically deploy on push

### Heroku

1. **Create App:**
   ```bash
   # Install Heroku CLI
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create your-app-name
   
   # Set buildpack
   heroku buildpacks:set heroku/nodejs
   ```

2. **Deploy:**
   ```bash
   # Push to Heroku
   git subtree push --prefix peta heroku main
   ```

### DigitalOcean App Platform

1. **Create App:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set run command: `npm start`
   - Configure environment variables

2. **Deploy:**
   - DigitalOcean will automatically deploy on push

Environment Variables
--------------------

Configure these environment variables for production:

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Platform-specific variables may also be required.

Docker Deployment
-----------------

Create a `Dockerfile` in the `peta` directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Python for math rendering
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Process content and build
RUN node scripts/process-content.js
RUN node scripts/render-math.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
# Build image
docker build -t peta .

# Run container
docker run -p 3000:3000 peta
```

Performance Optimization
-----------------------

### Caching

- Implement API response caching
- Use CDN for static assets
- Cache processed content

### Monitoring

- Set up application monitoring
- Monitor API response times
- Track error rates and performance

### Scaling

- Use load balancers for high traffic
- Implement horizontal scaling
- Consider database for content management

Troubleshooting
---------------

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

2. **API Errors:**
   - Ensure server is running, not static export
   - Check API routes are properly configured
   - Verify content processing completed

3. **Performance Issues:**
   - Monitor memory usage
   - Check API response times
   - Optimize content processing

### Debugging

Enable debug logging:

```bash
# Development
DEBUG=peta:* npm run dev

# Production
DEBUG=peta:* npm start
```

Check logs on your deployment platform for error details.

Security Considerations
----------------------

- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting for APIs
- Validate user inputs
- Monitor for security vulnerabilities