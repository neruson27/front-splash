<style>
.text-header {
  color: #a9d12a
}
.bg-header {
  background: #a9d12a
}
.text-footer {
  color: #a9d12a
}
.bg-footer {
  background: #a9d12a
}
.text-gris {
  color: #2d2f33
}
.bg-gris {
  background: #2d2f33
}
.text-franja {
  color: #2d2f33
}
.bg-franja {
  background: #2d2f33
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
      <q-page-sticky position="top-right" :offset="[18, 80]">
        <q-btn flat rounded type="a" href="">
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
