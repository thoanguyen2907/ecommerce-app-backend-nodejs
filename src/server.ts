import errorHandler from 'errorhandler'
import mongoose from 'mongoose'

import app from './app'
import { MONGODB_URI} from './util/secrets'

const mongoUrl = MONGODB_URI

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    // Start Express server
    console.log(mongoUrl)
    app.listen(app.get('port'), () => {
      console.log('Database running !!!', app.get('port'), app.get('env'))
      console.log('  Press CTRL-C to stop\n')
    })
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })
/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())
