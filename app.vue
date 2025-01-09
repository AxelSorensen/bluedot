<template>
  <div>

    <NuxtLayout>
      <NavBar />
      <NuxtPage />
    </NuxtLayout>



  </div>
</template>

<script setup>

onMounted(async () => {

  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });

})

</script>
