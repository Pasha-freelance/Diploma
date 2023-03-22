import * as controller from '../controllers/document.controller';
import { Router } from "express";
import { uploadFile } from "../middleware/file-upload.middleare";

const documentRouter = Router();

documentRouter.post('/upload', uploadFile.single('file'), controller.uploadDocument);
documentRouter.get('/upload', controller.getFile);

export default documentRouter;
