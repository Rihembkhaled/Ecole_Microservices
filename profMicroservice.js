//profMicroservice
const grpc = require('@grpc/grpc-js'); // For gRPC
const protoLoader = require('@grpc/proto-loader'); // For loading Protobuf
const mongoose = require('mongoose'); // For MongoDB
const Prof = require('./prof'); // Mongoose model for prof
const { sendProfMessage } = require('./profProducer'); // Kafka producer for prof

// Path to the Protobuf file
const profProtoPath = './prof.proto';

// Load the Protobuf
const profProtoDefinition = protoLoader.loadSync(profProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the gRPC prof service package
const profProto = grpc.loadPackageDefinition(profProtoDefinition).prof;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecole') // Use IPv4 to avoid issues
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process in case of error
  });

// gRPC service implementation for prof
const profService = {
  getProf: async (call, callback) => {
    try {
      const profId = call.request.prof_id;
      const prof= await Prof.findById(profId);

      if (!prof) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Prof not found" });
      }

      callback(null, { prof });
    } catch (err) {
      console.error("Error fetching prof:", err);
      callback({ code: grpc.status.INTERNAL, message: "Error fetching prof" });
    }
  },

  searchProfs: async (call, callback) => {
    try {
      const profs = await Prof.find();
      callback(null, { profs });
    } catch (err) {
      console.error("Error searching profs:", err);
      callback({ code: grpc.status.INTERNAL, message: "Error searching profs" });
    }
  },

  createProf: async (call, callback) => {
    try {
      const { nom,  description  } = call.request;
      const nouveauProf = new Prof({ nom,  description  });
      const prof = await nouveauProf.save();

      await sendProfMessage('creation', prof);

      callback(null, { prof });
    } catch (err) {
      console.error("Error creating prof:", err);
      callback({ code: grpc.status.INTERNAL, message: "Error creating prof" });
    }
  },

  updateProf: async (call, callback) => {
    try {
      const { Prof_id, nom,  description  } = call.request;
      const prof = await Prof.findByIdAndUpdate(
        prof_id,
        { nom,  description  },
        { new: true } // Return the updated prof
      );

      if (!prof) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Prof not found" });
      }

      await sendProfMessage('modification', prof);

      callback(null, { prof });
    } catch (err) {
      console.error("Error updating prof:", err);
      callback({ code: grpc.status.INTERNAL, message: "Error updating prof: " + err.message });
    }
  },

  deleteProf: async (call, callback) => {
    try {
      const profId = call.request.prof_id;
      const prof = await Prof.findByIdAndDelete(profId);

      if (!prof) {
        return callback({ code: grpc.status.NOT_FOUND, message: "Prof not found" });
      }

      await sendProfMessage('suppression', prof);

      callback(null, { message: "Prof deleted successfully" });
    } catch (err) {
      console.error("Error deleting prof:", err);
      callback({ code: grpc.status.INTERNAL, message: "Error deleting prof: " + err.message });
    }
  },
};


// Create the gRPC server
const server = new grpc.Server();
server.addService(profProto.ProfService.service, profService);

server.bindAsync('0.0.0.0:50055', grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
  if (err) {
    console.error("Failed to bind server:", err);
    return;
  }
  server.start();
  console.log(`Prof Service operational on port ${boundPort}`);
});
