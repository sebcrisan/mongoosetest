const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.use(express.json());

mongoose.connect(CONNECTION_STRING);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const projectSchema = new mongoose.Schema(
  {
    notifications: { type: Array, default: [] },
    sources: { type: Array, default: [] },
    name: String,
    project_number: Number,
    location: String,
    device_ids: [String],
    mount_locations_descriptions: [
      {
        description: String,
        type: String,
        category: String,
        mount_points: [
          {
            description: String,
            node_label: String,
            configration: String,
            device_id: String,
          },
        ],
        meter: String,
      },
    ],
    reporting: { type: Array, default: [] },
    user_ids: [
      {
        username: String,
        name: String,
        role: String,
        relation: String,
      },
    ],
    device_count: Number,
    start_date: Date,
    end_date: Date,
    date_switch: Boolean,
    last_contact: { type: Date, default: null },
    next_contact: { type: Date, default: null },
    siteDescription: {
      client_name: String,
      project_contact: String,
      monitored_project_description: String,
      motivation_for_measurement: String,
    },
    timestamp: Date,
    filter: {
      norm: String,
      category: String,
      measurementType: String,
      structure: String,
      vibrationType: String,
      pipeMaterial: String,
      liningMaterial: String,
    },
    client: {
      trace_length: String,
      trace_limit: String,
      update_interval: String,
    },
    alarm: {
      enable_led: Boolean,
      thresholds: {
        a: String,
        v: String,
      },
      trigger_axes: { type: Array, default: [] },
    },
    warning: {
      sclars: {
        a: String,
        v: String,
      },
    },
    night_mode: {
      enable: Boolean,
      alarm: {
        scale: String,
      },
      warning: {
        scale: String,
      },
    },
    schedule: {
      weekly_start: String,
      weekday_stop: String,
      weekend_start: String,
      weekend_stop: String,
      always_on: Boolean,
    },
    archived: Boolean,
    installed: Boolean,
    time_zone: String,
    customer_id: String,
    creator_id: mongoose.Types.ObjectId,
    __v: { type: Number, select: false },
  },
  { collection: "project_configration" }
);

const Project = mongoose.model("Project", projectSchema);

app.get("/api/projects/:id", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const project = await Project.findById(id);
    console.log(`id: ${req.params.id}\nproject: ${JSON.stringify(project)}`);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/projects", async (req, res) => {
  console.log("fetching all projects...");
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
