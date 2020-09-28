<style>
.text-header {
  color: #00bfb0
}
.bg-header {
  background: #00bfb0
}
.text-footer {
  color: #00bfb0
}
.bg-footer {
  background: #00bfb0
}
.text-gris {
  color: #2d2f33
}
.bg-gris {
  background: #2d2f33
}
.text-franja {
  color: #fbd283
}
.bg-franja {
  background: #fbd283
}
.bg-whatsapp {
  background: #25c166;
}
</style>
<template>
  <div id="q-app">
    <q-layout view="hhh Lpr lff" class="shadow-2 rounded-borders">
      <q-header>
        <Header></Header>
      </q-header>

      <q-page-container>
        <q-page>
          <Index></Index>
        </q-page>
      </q-page-container>

      <q-footer>
        <Footer></Footer>
      </q-footer>
      <q-page-sticky position="top-right" :offset="[18, 80]" v-if="!$store.state.user.isAuthenticated">
        <q-btn flat rounded type="a" href="https://wa.me/573013310597?text=Hola, estoy interesado en recibir informacion de sus productos.">
          <q-img src="/statics/img/whatsapp.svg" height="50px" width="50px"></q-img>
        </q-btn>
      </q-page-sticky>
    </q-layout>
  </div>
</template>

<script>
import Index from "@/components/layout/Index";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default {
  name: "App",
  components: {
    Index,
    Header,
    Footer
  },
  data() {
    return {};
  },
};
</script>
