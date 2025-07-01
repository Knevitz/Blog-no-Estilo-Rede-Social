angular.module('AppSocial', [])
  .controller('PostController', function ($scope) {
    $scope.posts = [
      {
        nome: "Nação dos guri da silva hehehe😂",
        usuario: "ddddd",
        texto: "Sou hétero mas amoooo o Neymar sério, jurooo!!! que surto foi esse!!!!",
        tags: ["musica", "academia", "lifestyle"],
        data: new Date()
      }
    ];
  });
angular.module('AppSocial', [])
      .controller('PerfilController', function($scope) {
        $scope.perfil = {
          nome: 'Nação dos guri da silva hehehe😴',
          usuario: 'Gremiodasilva'
        };

        $scope.posts = [
          {
            nome: 'Nação dos guri da silva hehehe😴',
            usuario: 'gremiodasilva',
            conteudo: 'Sou hétero mais ansioso q neymar sarrá, jurooo!! que surto foi ess!!!🔥',
            tags: ['música', 'resenha', 'freestyle'],
            data: new Date()
          }
        ];
      });