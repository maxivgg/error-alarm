import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}
To generate test errors, open your web browser and visit http://localhost:${PORT}.
You can find log files in the src folder.`)
);
