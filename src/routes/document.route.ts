import { Router } from "express";
import { uploadFile } from "../middleware/file-upload.middleare";
import { DocumentsController } from "../controllers/document.controller";

const documentRouter = Router();
const documentsController = new DocumentsController();

documentRouter.post('/upload', uploadFile.single('file'), documentsController.uploadDocument);
documentRouter.get('/upload', documentsController.getFile);

export default documentRouter;
