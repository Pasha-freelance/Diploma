import app from './app';
import dbConfig from './src/config/database'

const port = process.env.API_PORT;
dbConfig();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
