import express from "express";

export default (apiRouter: express.Router) => {
  const router = express.Router();

  router.use(apiRouter);

  return router;
};
