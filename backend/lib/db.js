/**
 * Insert a metrics document into the database
 *
 * Returns a Promise fullfuled with the result of the insertion
 */
module.exports.write = function (data) {
  return new Promise(function (accept, reject) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      if (err) reject(err)
      // Note that the insert method can take either an array or a dict.
      
      // Select "table" (collection)
      const metrics = db.collection('metrics');

      metrics.insert([data], function(err, result) {
        if (err) reject(err)

        accept(result)
      })
    })
  })
  
}

/**
 * Get a all metrics taken by a sensor between two dates
 *
 * @param options.sensor   - ID of the sensor
 * @param options.start    - starting UNIX timestamp
 * @param options.end      - ending UNIX timestamp
 *
 * Returns a Promise fulfilled with the data from the DB
 */
module.exports.select = function (options) {
  const sensor = options.sensor
  const start  = options.start
  const end    = options.end
  return new Promise(function (accept, reject) {
    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      if (err) reject(err)
      // Note that the insert method can take either an array or a dict.
      
      // Select "table" (collection)
      const metrics = db.collection('metrics')
      metrics.find({
          timestamp : {
            $gte: start,
            $lte: end,
          },
          sensor: {
            $eq: sensor
          }
        })
        .toArray(function (err, docs) {
          if (err) reject(err)
          
          accept(docs)
        })
    })
  })
}
