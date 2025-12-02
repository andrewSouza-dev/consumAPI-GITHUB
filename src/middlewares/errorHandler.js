// Middleware de tratamento de erros
function errorHandler(err, req, res, next) {
  console.error(err.stack); // log no console

  // Se já foi enviado algo, não tenta responder de novo
  if (res.headersSent) {
    return next(err);
  }

  // Resposta genérica
  res.status(err.status || 500);
  res.render("errors/error", {
    message: err.message || "Erro interno no servidor",
    status: err.status || 500
  });
}

module.exports = errorHandler;
