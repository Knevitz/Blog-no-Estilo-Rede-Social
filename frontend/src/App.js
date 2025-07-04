angular.module("AppSocial", []).filter("tempoPostagem", function () {
  return function (input) {
    if (!input) return "";

    const postDate = new Date(input);
    const now = new Date();

    const diffMs = now.getTime() - postDate.getTime();
    if (diffMs < 0) return "Agora mesmo";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return "Agora mesmo";
    if (diffMin < 60) return `Há ${diffMin} minuto${diffMin > 1 ? "s" : ""}`;
    if (diffHrs < 24) return `Há ${diffHrs} hora${diffHrs > 1 ? "s" : ""}`;
    return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  };
});

angular
  .module("AppSocial")
  .controller("PostController", function ($scope, $http, $interval, $location) {
    $scope.sidebarAberta = false;
    $scope.seguidos = [];
    $scope.usuarioLogado = null;
    $scope.posts = [];
    $scope.novoPost = {
      content: "",
      tags: [],
    };
    $scope.editandoPost = null;
    $scope.novaTag = "";
    $scope.abrirModalNovoPost = function () {
      var modal = new bootstrap.Modal(document.getElementById("modalNovoPost"));
      modal.show();
    };

    // Menu functions
    $scope.abrirMenu = function () {
      $scope.sidebarAberta = !$scope.sidebarAberta;
    };

    $scope.abrirPerfil = function (usuario) {
      if (!usuario) return;
      $location.path("/perfil/" + usuario.usuario);
    };

    // Post CRUD functions
    $scope.criarPost = function () {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para criar um post.");
        return;
      }

      $http({
        method: "POST",
        url: "http://localhost:3000/posts",
        data: $scope.novoPost,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          $scope.posts.unshift({
            id: response.data.id,
            nome: $scope.usuarioLogado.nome,
            usuario: $scope.usuarioLogado.usuario,
            conteudo: response.data.content,
            tags: response.data.tags || [],
            data: response.data.createdAt,
            curtido: false,
          });
          $scope.novoPost = { content: "", tags: [] };
          alert("Post criado com sucesso!");
        })
        .catch(function (error) {
          alert(
            "Erro ao criar post: " +
              (error.data?.message || "Erro desconhecido")
          );
        });
    };

    $scope.editarPost = function (post) {
      $scope.editandoPost = angular.copy(post);
      $scope.editandoPost.tags = post.tags.join(", ");
    };

    $scope.salvarEdicao = function () {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para editar um post.");
        return;
      }

      const postData = {
        content: $scope.editandoPost.conteudo,
        tags: $scope.editandoPost.tags.split(",").map((tag) => tag.trim()),
      };

      $http({
        method: "PATCH",
        url: `http://localhost:3000/posts/${$scope.editandoPost.id}`,
        data: postData,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          const index = $scope.posts.findIndex(
            (p) => p.id === $scope.editandoPost.id
          );
          if (index !== -1) {
            $scope.posts[index].conteudo = response.data.content;
            $scope.posts[index].tags = response.data.tags || [];
            $scope.posts[index].data = response.data.updatedAt;
          }
          $scope.editandoPost = null;
          alert("Post atualizado com sucesso!");
        })
        .catch(function (error) {
          alert(
            "Erro ao atualizar post: " +
              (error.data?.message || "Erro desconhecido")
          );
        });
    };

    $scope.cancelarEdicao = function () {
      $scope.editandoPost = null;
    };

    $scope.deletarPost = function (index) {
      if (confirm("Tem certeza que deseja deletar este post?")) {
        const post = $scope.posts[index];
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Usuário não autenticado.");
          return;
        }

        $http({
          method: "DELETE",
          url: `http://localhost:3000/posts/${post.id}`,
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(() => {
            $scope.posts.splice(index, 1);
            alert("Post deletado com sucesso.");
          })
          .catch((err) => {
            alert(
              "Erro ao deletar post: " +
                (err.data?.message || "Erro desconhecido")
            );
          });
      }
    };

    $scope.adicionarTag = function () {
      if ($scope.novaTag && !$scope.novoPost.tags.includes($scope.novaTag)) {
        $scope.novoPost.tags.push($scope.novaTag);
        $scope.novaTag = "";
      }
    };

    $scope.removerTag = function (tag) {
      const index = $scope.novoPost.tags.indexOf(tag);
      if (index !== -1) {
        $scope.novoPost.tags.splice(index, 1);
      }
    };

    // Like functions - Versão Corrigida
    $scope.curtir = function (post) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para curtir um post.");
        return;
      }

      // Verifica se o post tem ID válido
      if (!post.id) {
        console.error("Post sem ID válido:", post);
        return;
      }

      const method = post.curtido ? "DELETE" : "POST";

      $http({
        method: method,
        url: `http://localhost:3000/api/posts/${post.id}/like`, // Adicionado /api/
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          post.curtido = !post.curtido;
          if (post.curtido) {
            post.likesCount = (post.likesCount || 0) + 1;
          } else {
            post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
          }
        })
        .catch(function (error) {
          console.error("Erro na requisição de like:", error);
          alert(
            "Erro ao curtir post: " +
              (error.data?.message || "Erro desconhecido")
          );
        });
    };

    $scope.comentar = function (post) {
      const comentario = prompt("Digite seu comentário:");
      if (!comentario) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para comentar.");
        return;
      }

      $http({
        method: "POST",
        url: `http://localhost:3000/posts/${post.id}/comments`,
        data: { content: comentario },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          if (!post.comentarios) {
            post.comentarios = [];
          }
          post.comentarios.push({
            content: comentario,
            author: {
              name: $scope.usuarioLogado.nome,
              username: $scope.usuarioLogado.usuario,
            },
            createdAt: new Date(),
          });
          alert("Comentário adicionado com sucesso!");
        })
        .catch(function (error) {
          alert(
            "Erro ao comentar: " + (error.data?.message || "Erro desconhecido")
          );
        });
    };

    // Load data functions
    $scope.loadPosts = function () {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      $http({
        method: "GET",
        url: "http://localhost:3000/posts",
        headers: headers,
      })
        .then(function (response) {
          $scope.posts = response.data.map((post) => ({
            id: post.id,
            nome: post.author.name,
            usuario: post.author.username,
            conteudo: post.content,
            tags: post.tags || [],
            data: post.createdAt,
            curtido: post.likedByUser || false,
            likesCount: post.likesCount || 0,
            comentarios: post.comments || [],
          }));
        })
        .catch(function (error) {
          console.error("Erro ao carregar posts:", error);
        });
    };

    $scope.loadUsuarios = function () {
      const token = localStorage.getItem("token");
      if (!token) return;

      $http({
        method: "GET",
        url: "http://localhost:3000/usuarios/seguidos",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          $scope.seguidos = response.data;
        })
        .catch(function (err) {
          console.error("Erro ao carregar usuários seguidos:", err);
        });

      carregarUsuarioLogado();
    };

    function carregarUsuarioLogado() {
      const token = localStorage.getItem("token");
      if (!token) return;

      $http({
        method: "GET",
        url: "http://localhost:3000/auth/profile",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(function (response) {
          $scope.usuarioLogado = response.data;
        })
        .catch(function (err) {
          console.error("Erro ao carregar usuário logado:", err);
        });
    }

    // Initialize
    $scope.loadUsuarios();
    $scope.loadPosts();

    // Auto-refresh posts every 30 seconds
    $interval(() => {
      $scope.loadPosts();
    }, 30000);
  });
