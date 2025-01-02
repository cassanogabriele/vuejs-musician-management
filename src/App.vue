<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
          <RouterLink class="navbar-brand" to="/">Musician Management</RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/">Accueil</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/about">A propos</RouterLink>
              </li>             
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/musicians">Musiciens</RouterLink>
              </li>  
            </ul>            
          </div>
        </div>
      </nav>
    </div>
  </header>

  <div class="container mt-4 mb-4">
    <div class="alert alert-danger" role="alert">
      ⚠ Cette application est un site de démonstration, contenant des données fictives, et ayant pour unique objectif, de présenter mes compétences en Vue JS. (API en Laravel)
    </div>
  </div>

  <RouterView />
</template>