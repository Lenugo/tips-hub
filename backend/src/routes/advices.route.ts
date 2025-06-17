import { Router } from 'express'
import { getAllAdvices, createAdvice, getAdviceById, updateAdvice, deleteAdvice, getAllAdvicesByUser, incrementLikes } from '../controllers/advice.controller'
import { authenticateToken } from '../middlewares/user.middleware'

const router = Router()

router.get('/', (req, res) => {
  /**
   * #swagger.tags = ['Advices'] 
   * #swagger.path = '/advices'
   * #swagger.method = 'get'
   * #swagger.description = 'Endpoint to get all tips'
   */
  /* #swagger.parameters['categories'] = {
    in: 'query',
    description: 'Filter by categories (comma separated)',
    type: 'string',
    enum: ['career', 'relationships', 'health', 'finance', 'personal-growth', 'productivity', 'education']
  } */
  /* #swagger.parameters['page'] = {
    in: 'query',
    description: 'Page number',
    type: 'integer'
  } */
  /* #swagger.parameters['limit'] = {
    in: 'query',
    description: 'Results limit per page',
    type: 'integer'
  } */
  /* #swagger.parameters['sortBy'] = {
    in: 'query',
    description: 'Field to sort by',
    type: 'string'
  } */
  /* #swagger.parameters['order'] = {
    in: 'query',
    description: 'Sort order (asc or desc)',
    type: 'string'
  } */
  /* #swagger.responses[200] = {
    description: 'List of tips',
    schema: {
      success: true,
      data: [
        {
          id: '681b67d70a5a4288e934ca73',
          title: 'Develop your career with passion and purpose',
          content: 'Your job should not be just about making money; it should be something that fills you and keeps you going forward.',
          author: {
            _id: '6819760709e0b7197558d836',
            username: 'John Doe',
            email: 'example.mail.com'
          },
          publishedDate: '2025-05-07T14:01:59.307Z',
          categories: [
            'carrer',
            'productivity'
          ],
          likes: 2,
          likedBy: [
            '681fd0c21e96734eb0336be9',
            '6819760709e0b7197558d836'
          ],
          createdAt: '2025-05-07T14:01:59.310Z'
        }
      ]
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Advices not found',
    schema: {
      success: false,
      error: 'No advices found matching the criteria'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'An error occurred while fetching advices'
    }
  } */
  getAllAdvices(req, res)
})

router.get('/user', authenticateToken, (req, res) => {
  /**
    #swagger.tags = ['Advices']
    #swagger.path = '/advices/user'
    #swagger.method = 'get'
    #swagger.description = 'Endpoint to get all tips by user'
    #swaagger.headers = {
    Authorization: {
      description: 'Bearer token for authentication',
      type: 'string',
      required: true
    }
    #swagger.security = [{ "bearerAuth": [] }]
  */
  /* #swagger.responses[200] = {
    description: 'List of user tips',
    schema: {
      success: true,
      data: [
        {
          id: '681b67d70a5a4288e934ca73',
          title: 'Develop your career with passion and purpose',
          content: 'Your job should not be just about making money; it should be something that fills you and keeps you going forward.',
          author: {
            _id: '6819760709e0b7197558d836',
            username: 'John Doe',
            email: 'example@mail.com'
          },
          publishedDate: '2025-05-07T14:01:59.307Z',
          categories: [
            'career',
            'productivity'
          ],
          likes: 2,
          likedBy: [
            '681fd0c21e96734eb0336be9',
            '6819760709e0b7197558d836'
          ],
          createdAt: '2025-05-07T14:01:59.310Z'
        }
      ]
    }
  } */
  /* #swagger.responses[400] = {
    description: 'User ID is required',
    schema: {
      success: false,
      error: 'Invalid ID format. Must be a valid MongoDB ObjectId'
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      error: 'Unauthorized'
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Advices not found',
    schema: {
      success: false,
      error: 'Advices not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  getAllAdvicesByUser(req, res)
})

router.get('/:id', (req, res) => {
  /**
   * #swagger.tags = ['Advices']
   * #swagger.path = '/advices/{id}'
   * #swagger.method = 'get'
   * #swagger.description = 'Endpoint to get a tip by ID'
   */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'Tip ID',
    required: true,
    type: 'MongoDB ObjectId',
    length: 24
  } */
  /* #swagger.responses[200] = {
    description: 'Tip found',
    schema: {
      success: true,
      data: {
        id: '681b67d70a5a4288e934ca73',
        title: 'Develop your career with passion and purpose',
        content: 'Your job should not be just about making money; it should be something that fills you and keeps you going forward.',
        author: {
          _id: '6819760709e0b7197558d836',
          username: 'John Doe',
          email: 'example@mail.com'
        },
        publishedDate: '2025-05-07T14:01:59.307Z',
        categories: [
          'career',
          'productivity'
        ],
        likes: 2,
        likedBy: [
          '681fd0c21e96734eb0336be9',
          '6819760709e0b7197558d836'
        ],
        createdAt: '2025-05-07T14:01:59.310Z'
      }
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Tip not found',
    schema: {
      success: false,
      error: 'Advice not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  getAdviceById(req, res)
})

router.post('/', authenticateToken, (req, res) => {
  /**
   * #swagger.tags = ['Advices']
   * #swagger.path = '/advices'
   * #swagger.method = 'post'
   * #swagger.description = 'Endpoint to create a new tip'
   * #swaagger.headers = {
    Authorization: {
      description: 'Bearer token for authentication',
      type: 'string',
      required: true
    }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Tip information',
    required: true,
    schema: {
      $title: 'Advices to enhance your career',
      $content: 'Set clear and specific goals for each day. Prioritize your tasks based on their importance and urgency. Eliminate distractions during your work hours.',
      $categories: ['career', 'productivity'],
    }
  } */
  /* #swagger.responses[201] = {
    description: 'Tip created successfully',
    schema: {
      success: true,
      data: {
        id: '681b67d70a5a4288e934ca73',
        title: 'Advices to enhance your career',
        content: 'Set clear and specific goals for each day. Prioritize your tasks based on their importance and urgency. Eliminate distractions during your work hours.',
        author: {
          _id: '6819760709e0b7197558d836',
          username: 'John Doe',
          email: 'example@mail.com'
        },
        publishedDate: '2023-01-01T00:00:00.000Z',
        categories: ['career', 'productivity'],
        likes: 0,
        likedBy: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      error: 'Validation error',
      errors: {
        message: 'String must contain at least 3 character(s)',
        expected: 'string',
        received: 'string'
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      error: 'Unauthorized'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  createAdvice(req, res)
})

router.post('/likes/:id', authenticateToken, (req, res) => {
  /**
   * #swagger.tags = ['Advices']
   * #swagger.path = '/advices/likes/{id}'
   * #swagger.method = 'post'
   * #swagger.description = 'Endpoint to like a tip'
   * #swaagger.headers = {
    Authorization: {
      description: 'Bearer token for authentication',
      type: 'string',
      required: true
    }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'Tip ID',
    required: true,
    type: 'string'
  } */
  /* #swagger.responses[200] = {
    description: 'Like added successfully',
    schema: {
      success: true,
      data: {
        id: '681b67d70a5a4288e934ca73',
        title: 'Develop your career with passion and purpose',
        content: 'Your job should not be just about making money; it should be something that fills you and keeps you going forward.',
        author: {
          _id: '6819760709e0b7197558d836',
          username: 'Testing',
          email: 'test@mail.com'
        },
        publishedDate: '2025-05-07T14:01:59.307Z',
        categories: [
          'career',
          'productivity'
        ],
        likes: 3,
        likedBy: [
          '681fd0c21e96734eb0336be9',
          '6819760709e0b7197558d836',
          '681976f709e0b7197558d837'
        ],
        createdAt: '2025-05-07T14:01:59.310Z'
      },
      action: 'liked'
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      message: 'Invalid ID format. Must be a valid MongoDB ObjectId',
    }
  }*/
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      error: 'Unauthorized'
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Tip not found',
    schema: {
      success: false,
      error: 'Advice not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  incrementLikes(req, res)
})

router.patch('/:id', authenticateToken, (req, res) => {
  /**
   * #swagger.tags = ['Advices']
   * #swagger.path = '/advices/{id}'
   * #swagger.method = 'patch'
   * #swagger.description = 'Endpoint to update a tip'
   * #swaagger.headers = {
    Authorization: {
      description: 'Bearer token for authentication',
      type: 'string',
      required: true
    }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'Tip ID',
    required: true,
    type: 'string'
  } */
  /* #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Updated tip information',
    required: true,
    schema: {
      title: 'Advices to enhance your career',
      content: 'Set clear and specific goals for each day. Prioritize your tasks based on their importance and urgency. Eliminate distractions during your work hours.',
      categories: ['career', 'productivity', 'personal-growth'],
    }
  } */
  /* #swagger.responses[200] = {
    description: 'Tip updated successfully',
    schema: {
      success: true,
      data: {
        id: '681b67d70a5a4288e934ca73',
        title: 'Advices to enhance your career',
        content: 'Set clear and specific goals for each day. Prioritize your tasks based on their importance and urgency. Eliminate distractions during your work hours.',
        author: {
          _id: '6819760709e0b7197558d836',
          username: 'Testing',
          email: 'test@mail.com'
        },
        publishedDate: '2023-01-01T00:00:00.000Z',
        categories: ['career', 'productivity', 'personal-growth'],
        likes: 1,
        likedBy: [
          '6819760709e0b7197558d836'
        ],
        createdAt: '2025-05-07T14:01:59.310Z'
      }
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      error: 'Validation error',
      errors: {
        message: 'String must contain at least 3 character(s)',
        expected:'string',
        received:'string'
      }
    }
  } */
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      error: 'Unauthorized'
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Tip not found',
    schema: {
      success: false,
      error: 'Advice not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  updateAdvice(req, res)
})

router.delete('/:id', authenticateToken, (req, res) => {
  /**
   * #swagger.tags = ['Advices']
   * #swagger.path = '/advices/{id}'
   * #swagger.method = 'delete'
   * #swagger.description = 'Endpoint to delete a tip'
   * #swaagger.headers = {
    Authorization: {
      description: 'Bearer token for authentication',
      type: 'string',
      required: true
    }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'Tip ID',
    required: true,
    type: 'string'
  } */
  /* #swagger.responses[200] = {
    description: 'Tip deleted successfully',
    schema: {
      success: true,
      data: {
        message: 'Advice deleted'
      }
    }
  } */
  /* #swagger.responses[400] = {
    description: 'Validation error',
    schema: {
      success: false,
      message: 'Invalid ID format. Must be a valid MongoDB ObjectId' 
    } 
  }*/
  /* #swagger.responses[401] = {
    description: 'Unauthorized',
    schema: {
      success: false,
      error: 'Unauthorized'
    }
  } */
  /* #swagger.responses[404] = {
    description: 'Tip not found',
    schema: {
      success: false,
      error: 'Advice not found'
    }
  } */
  /* #swagger.responses[500] = {
    description: 'Internal server error',
    schema: {
      success: false,
      error: 'Server Error'
    }
  } */
  deleteAdvice(req, res)
})

export default router
