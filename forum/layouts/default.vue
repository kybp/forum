<template>
  <header>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/formatting">Formatting</NuxtLink>
    </nav>
    <UserControls />
  </header>

  <div>
    <slot />
  </div>
</template>
