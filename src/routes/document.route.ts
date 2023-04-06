import { Router } from "express";
import { uploadFile } from "../middleware/file-upload.middleare";
import { DocumentsController } from "../controllers/document.controller";
import authMiddleware from "../middleware/auth.middleware";

const documentRouter = Router();
const documentsController = new DocumentsController();

documentRouter.post('/upload', authMiddleware, uploadFile.single('file'), documentsController.uploadDocument.bind(documentsController));
documentRouter.get('/download', documentsController.getFile.bind(documentsController));
documentRouter.get('/downloadAll', authMiddleware, documentsController.getAllDocuments.bind(documentsController));

export default documentRouter;
