import { Router } from 'express'
import { register, login, logout, userProfile, verifyToken } from '../controllers/auth.controller'
import { authenticateToken } from '../middlewares/user.middleware'

const router = Router()

router.post('/register', (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.method = 'post'
   * #swagger.description = 'Endpoint to register a new user.'
   * #swagger.path = '/auth/register' 
   */
  /* #swagger.parameters['user'] = {
    in: 'path',
    description: 'Register user',
    required: true,
    type: 'string'
  } */
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'User information.',
    required: true,
    schema: {
      userName: 'John Doe',
      email: 'example.mail.com',
      password: 'PASSWORD1234'
    }
  } */
  /* #swagger.responses[201] = {
    description: 'User created successfully',
    schema: {
      success: true,
      message: 'User created successfully'
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      message: 'Validation error',
      errors: {
        message: 'Validation error',
        expected: 'string',
        received: 'number'
      }
    }
  } */
  /* #swagger.responses[409] = {
    description: 'User already exists',
    schema: {
      success: false,
      message: 'User already exists'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      message: 'Internal server error'
    }
  } */
  register(req, res)
})

router.post('/login', (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.path = '/auth/login'
   * #swagger.method = 'post'
   * #swagger.description = 'Endpoint to login a user.'
   */
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'User information.',
    schema: { 
      email: 'example.mail.com',
      password: 'PASSWORD1234'
    }
  } */
  /* #swagger.responses[200] = {
    description: 'User logged in successfully',
    schema: {
      success: true,
      message: 'User logged in successfully'
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      message: 'Validation error',
      errors: {
        message: 'Validation error',
        expected:'string',
        received: 'number'
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'User not found',
    schema: {
      success: false,
      message: 'User not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      message: 'Internal server error'
    }
  } */
  login(req, res)
})

router.post('/logout', (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.path = '/auth/logout'
   * #swagger.method = 'post'
   * #swagger.description = 'Endpoint to logout a user.'
   */
  /* #swagger.responses[200] = {
    description: 'User logged out successfully',
    schema: {
      success: true,
      message: 'User logged out successfully'
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      message: 'Unauthorized'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      message: 'Internal server error'
    }
  } */
  logout(req, res)
})

router.get('/check', (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.path = '/auth/check'
   * #swagger.method = 'get'
   * #swagger.description = 'Endpoint to check if the user is logged in.'
   */
  /* #swagger.responses[200] = {
    description: 'User is logged in',
    schema: {
      authenticated: true,
      message: 'User is logged in',
      user: {
        id: '681fd0c21e98734eb0336be7',
        userName: 'John Doe',
        email: 'example@mail.com',
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      authenticated: false,
      message: 'Unauthorized'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      authenticated: false,
      message: 'Internal server error'
    }
  } */
  verifyToken(req, res)
})

router.get('/profile', authenticateToken, (req, res) => {
  /**
   * #swagger.tags = ['Auth']
   * #swagger.path = '/auth/profile'
   * #swagger.method = 'get'
   * #swagger.description = 'Endpoint to get the user profile.'
   * #swagger.security = [{ "cookieAuth": [] }]
   */
  /* #swagger.responses[200] = {
    description: 'User profile',
    schema: {
      success: true,
      user: {
        id: '681fd0c21e96834eb0336be8',
        userName: 'John Doe',
        email: 'example.mail.com',
        createdAt: '2023-06-01T00:00:00.000Z',
        updatedAt: '2023-06-01T00:00:00.000Z'
      }
    }
  }*/
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      message: 'Validation error',
      errors: {
        message: 'Validation error',
        expected:'string',
        received: 'number'
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      message: 'Unauthorized'
    }
  } */
  /* #swagger.responses[404] = {
    description: 'User not found',
    schema: {
      success: false,
      message: 'User not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      message: 'Internal server error'
    }
  } */
  userProfile(req, res)
})

export default router
