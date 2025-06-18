# OpenAI API Logging System

This document describes the comprehensive logging system implemented for all OpenAI API calls in the Thryve application.

## Overview

The logging system tracks every OpenAI API call with detailed information including:
- User details (ID, email)
- Request context (IP, method, path)
- API call details (model, tokens used, response time)
- Chat type (COACHING, ROLEPLAY, LEARNING_PLAN, LEADERSHIP_ASSESSMENT)
- Success/failure status
- Error details when applicable

## Log Files

### Main Log Files
- `src/logs/app.log` - General application logs
- `src/logs/error.log` - Error logs only
- `src/logs/openai-api.log` - **Dedicated OpenAI API call logs**

### Log Format

OpenAI API logs follow this format:
```
[timestamp] [OPENAI_API] [ReqID: xxx] [UserID: xxx] [Email: xxx] [IP: xxx] [Method: xxx] [Path: xxx] [Type: xxx] [Model: xxx] [Tokens: xxx] [Time: xxxms]: message
```

### Log Fields

| Field | Description |
|-------|-------------|
| `ReqID` | Request ID for tracking |
| `UserID` | User ID making the request |
| `Email` | User email address |
| `IP` | Client IP address |
| `Method` | HTTP method (GET, POST, etc.) |
| `Path` | API endpoint path |
| `Type` | Chat type (COACHING, ROLEPLAY, etc.) |
| `Model` | OpenAI model used (gpt-4, gpt-4o-mini) |
| `Tokens` | Total tokens used in the call |
| `Time` | Response time in milliseconds |

## Implemented Logging Points

### 1. Chat Box Controller (`/api/chat-box`)
- **File**: `src/controllers/chat-box/chat-box.js`
- **Chat Type**: `COACHING`
- **Model**: `gpt-4o-mini`
- **Logged**: User questions, system prompts, responses, errors

### 2. Role Play Controller (`/api/role-play`)
- **File**: `src/controllers/role-play/role-play.js`
- **Chat Type**: `ROLEPLAY`
- **Model**: `gpt-4o-mini`
- **Logged**: User questions, system prompts, responses, errors

### 3. Learning Plan Generator
- **File**: `src/helper/learning-plan/generateLearningPlan.js`
- **Chat Type**: `LEARNING_PLAN`
- **Model**: `gpt-4o-mini`
- **Logged**: Generation requests, system prompts, responses, parsing errors

### 4. Leadership Assessment Generator
- **File**: `src/helper/leadership-report/generateLeadershipAssessment.js`
- **Chat Type**: `LEADERSHIP_ASSESSMENT`
- **Model**: `gpt-4`
- **Logged**: Assessment requests, system prompts, responses, parsing errors

## Monitoring Tools

### Statistics Output
The stats command provides:
- Total API calls
- Success/failure counts
- Success rate percentage
- Breakdown by chat type
- Breakdown by model

## Environment Variables

The logging system uses these environment variables:

```env
LOG_DIR=src/logs                    # Log directory
LOG_LEVEL=info                      # Log level
LOG_MAX_SIZE=5242880               # Max file size (5MB)
LOG_MAX_FILES=5                    # Max number of log files
NODE_ENV=development               # Environment (affects console output)
```

## Log Rotation

Log files are automatically rotated when they reach the maximum size (5MB by default). The system keeps up to 5 rotated files by default.

## Security Considerations

- User input is truncated to 500 characters in logs
- System prompts are logged with length only (not full content)
- Response content is truncated to 200 characters
- Sensitive information is not logged

## Troubleshooting

### Common Issues

1. **Log files not created**
   - Ensure the `src/logs` directory exists
   - Check file permissions
   - Verify environment variables are set

2. **Missing user information**
   - Ensure user authentication middleware is working
   - Check that `req.user` is properly populated

3. **High log volume**
   - Adjust `LOG_MAX_SIZE` and `LOG_MAX_FILES`
   - Consider implementing log filtering

### Debug Mode

To enable debug logging, set:
```env
LOG_LEVEL=debug
```

## Integration with Existing Logging

The OpenAI logging system integrates with the existing Winston logger but uses a separate transport for OpenAI-specific logs. This allows for:

- Separate analysis of OpenAI API usage
- Easier monitoring of API performance
- Independent log rotation for OpenAI logs
- Dedicated error tracking for API issues

## Performance Impact

The logging system has minimal performance impact:
- Asynchronous logging operations
- Truncated content to reduce storage
- Efficient metadata extraction
- Separate log files to avoid blocking main application logs 