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
