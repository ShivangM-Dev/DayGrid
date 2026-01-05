import { DatabaseStatusChecker } from './db-checker.js'

async function testConnection() {
  console.log('Testing database connection...')
  
  const checker = new DatabaseStatusChecker()
  const status = await checker.checkDatabaseConnection()
  
  console.log('Database Status:', JSON.stringify(status, null, 2))
  
  if (status.isConnected) {
    console.log('✅ Database connection successful!')
    console.log(`Connection time: ${status.connectionTime}ms`)
    console.log(`Tables exist: ${status.details.tablesExist}`)
    console.log(`Users table: ${status.details.userTable}`)
    console.log(`Tasks table: ${status.details.tasksTable}`)
  } else {
    console.log('❌ Database connection failed!')
    console.log('Error:', status.error)
  }
}

testConnection().catch(console.error)