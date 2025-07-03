angular
  .module("AppSocial", [])
  .filter("tempoPostagem", function () {
    return function (input) {
      if (!input) return "";

      const postDate = new Date(input);
      const now = new Date();

      const diffMs = now.getTime() - postDate.getTime();
      if (diffMs < 0) return "Hoje";

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHrs = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffSec < 24) return "Hoje";
      return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
    };
  })
  .controller("PostController", function ($scope, $http, $interval) {
    $scope.sidebarAberta = false; // controla o estado do menu lateral
    $scope.seguidos = []; // lista de usuários seguidos
    $scope.usuarioLogado = null; // dados do usuário atual
    $scope.posts = []; // lista de postagens

    $scope.abrirMenu = function () {
      $scope.sidebarAberta = !$scope.sidebarAberta;
    };

    $scope.loadUsuarios = function () {
      // Carrega os usuários seguidos
      $http
        .get("http://localhost:3000/usuarios/seguidos")
        .then(function (response) {
          $scope.seguidos = response.data;
        })
        .catch(function (err) {
          console.error("Erro ao carregar usuários seguidos:", err);
        });

      // Carrega o usuário logado
      $http
        .get("http://localhost:3000/usuarios/logado")
        .then(function (response) {
          $scope.usuarioLogado = response.data;
        })
        .catch(function (err) {
          console.error("Erro ao carregar usuário logado:", err);
        });
    };

    $scope.loadPosts = function () {
      $http
        .get("http://localhost:3000/posts")
        .then(function (response) {
          $scope.posts = response.data.map((post) => ({
            id: post.id,
            nome: post.author.name,
            usuario: post.author.username,
            conteudo: post.content,
            tags: post.tags || [],
            data: post.createdAt,
            curtido: false,
          }));
        })
        .catch(function (error) {
          console.error("Erro ao carregar posts:", error);
        });
    };

    $scope.abrirPerfil = function (usuario) {
      if (!usuario) return;
      alert("Ir para o perfil de @" + usuario.usuario);
    };

    $scope.curtir = function (post) {
      post.curtido = !post.curtido;
      alert("Você curtiu o post de @" + post.usuario);
    };

    $scope.comentar = function (post) {
      alert("Comentando no post de @" + post.usuario);
    };

    $scope.deletarPost = function (index) {
      if (confirm("Tem certeza que deseja deletar este post?")) {
        $scope.posts.splice(index, 1);
      }
    };

    $scope.abrirNovoPost = function () {
      alert("Abrir modal ou formulário para novo post...");
    };

    // Inicialização
    $scope.loadUsuarios();
    $scope.loadPosts();

    // Atualização automática do tempo dos posts
    $interval(function () {
      $scope.$applyAsync();
    }, 60000);
  });
