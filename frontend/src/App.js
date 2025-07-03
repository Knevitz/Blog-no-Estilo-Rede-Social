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
    $scope.sidebarAberta = false;
    $scope.seguidos = [];
    $scope.usuarioLogado = null;
    $scope.posts = [];

    $scope.abrirMenu = function () {
      $scope.sidebarAberta = !$scope.sidebarAberta;
    };

    function renovarToken() {
      return $http
        .post(
          "http://localhost:3000/auth/refresh-token",
          {},
          { withCredentials: true }
        )
        .then((res) => {
          localStorage.setItem("token", res.data.accessToken);
          return res.data.accessToken;
        });
    }

    function carregarUsuarioLogado() {
      const token = localStorage.getItem("token");
      if (!token) return;

      $http
        .get("http://localhost:3000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
          $scope.usuarioLogado = response.data;
        })
        .catch(function (err) {
          if (err.status === 401) {
            renovarToken()
              .then((novoToken) => {
                return $http.get("http://localhost:3000/auth/profile", {
                  headers: { Authorization: `Bearer ${novoToken}` },
                });
              })
              .then(function (response) {
                $scope.usuarioLogado = response.data;
              })
              .catch(function (erroFinal) {
                console.error("Erro ao renovar token:", erroFinal);
              });
          } else {
            console.error("Erro ao carregar usuário logado:", err);
          }
        });
    }

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

      // Carrega o perfil do usuário logado
      carregarUsuarioLogado();
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
