const API_BASE = "http://localhost:3000";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const mensagemEl = document.getElementById("mensagem");
  if (mensagemEl) {
    mensagemEl.textContent = "";
  }

  if (!email || !senha) {
    alert("Preencha e-mail e senha.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.message || "Erro ao fazer login.");
      return;
    }

    const data = await res.json();
    // Exemplo: salvar token JWT no localStorage para acesso futuro
    localStorage.setItem("token", data.token);

    alert("Login realizado com sucesso!");
    // Redirecionar para a página principal do sistema (ajuste conforme seu fluxo)
    window.location.href = "home.html";
  } catch (error) {
    alert("Erro na conexão com o servidor.");
  }
});
