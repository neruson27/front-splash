<template>
  <section class="bg-secondary text-white" v-if="!$store.state.user.isAuthenticated && $route.name !== 'login'">
    <div class="row justify-center text-center bg-franja">
      <div class="col-12" style="height:30px;"></div>
    </div>
    <div class="row justify-center bg-footer">
      <div class="col-xl-10 col-lg-10 col-md-10 col-sm-10 col-xs-10">
        <div class="row">
          <div class="col-lg-5 col-xl-5 col-md-5 col-sm-12 col-xs-12 self-center">
            <q-img src="/statics/img/logo_1.svg" contain style="width: 280px; height: 180px;" />
          </div>
          <div class="col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12 self-center">
            <div class="row justify-center text-left">
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-facebook-box"
                  size="md"
                  flat
                  label="@splash_colombia"
                ></q-btn>
              </div>
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-instagram"
                  size="md"
                  flat
                  label="@splashcolombiap"
                ></q-btn>
              </div>
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-headset"
                  size="md"
                  flat
                  label="Servicio al cliente"
                  type="a"
                  href="tel:+573013310597"
                ></q-btn>
              </div>
              <div class="col-12 q-ma-sm q-ml-xl q-mt-md">
                <span style="font-size:10px;" class="text-bold">Pago Online Seguro</span>
                <br />
                <q-img src="statics/img/logo_epayco_400px.png" spinner-color="white" width="20%"  class="q-mb-md" container/>
                <br />
                <q-img src="statics/img/parte_1.png" spinner-color="white" width="60%" />
                <br />
                <q-img src="statics/img/parte_2.png" spinner-color="white" width="60%" />
              </div>
              <div class="col-12 q-ma-sm q-ml-xl"></div>
            </div>
          </div>
          <div class="col-lg-3 col-xl-3 col-md-3 col-sm-12 col-xs-12 self-center">
            <div class="row">
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-google-maps"
                  flat
                  label="Calle 33#26-50 barrio..."
                >
                <q-tooltip content-class="bg-gris">Calle 33#26-50 barrio - Antonia Santos</q-tooltip>
                </q-btn>
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-map"
                  flat
                  label="Bucaramanga - Colombia"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-whatsapp"
                  flat
                  label="+57 301 3310597"
                  type="a"
                  href="https://wa.me/573013310597"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-phone-settings-outline"
                  flat
                  label="+57 301 3310597"
                  type="a"
                  href="tel:+573013310597"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="white"
                  icon="mdi-email"
                  flat
                  label="comercial@perfumesy..."
                  type="a"
                  href="mailto:comercial@perfumesysplash.com"
                >
                <q-tooltip content-class="bg-gris">comercial@perfumesysplash.com</q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row q-ml-md q-mt-xs q-mb-sm">
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" :class="$q.screen.lt.md ? 'q-pl-md q-py-sm' : 'q-pl-xl q-py-md'" style="background-color:#262626;">
      <span class="text-justify q-mr-xs" :class="$q.screen.lt.md ? 'text-caption text-foot' : ''">Políticas de privacidad y tratamiento de datos personales</span>

      <span class="text-justify q-mr-xs" :class="$q.screen.lt.md ? 'text-caption text-foot' : ''">© 2020 Perfumes y Splash Todos los derechos reservados</span>

      <span class="text-justify" :class="$q.screen.lt.md ? 'text-caption text-foot' : 'text-no-wrap'">Prohibida la copia, reproducción parcial o total de los contenidos</span>
    </div>
  </section>
</template>
<script>
export default {
  name: "Footer"
};
</script>