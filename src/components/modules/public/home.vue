<template>
  <div>
    <div class="row justify-center">
      <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <q-carousel
          animated
          v-model="slide"
          navigation
          infinite
          autoplay
          arrows
          transition-prev="slide-right"
          transition-next="slide-left"
          control-color="header"
          :height="$q.screen.lt.md ? '50vw' : ''"
        >
          <q-carousel-slide v-for="(img, index) in slider" :key="img._id" :name="index+1">
            <a :href="img.url" v-if="img.url"><q-img :src="config.api.url + img.image" height="100%" contain></q-img></a>
            <q-img :src="config.api.url + img.image" height="100%" contain v-else></q-img>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12 q-ma-lg" v-if="$q.screen.gt.sm">
        <p class="text-h6">NUEVOS PRODUCTOS</p>
      </div>
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div class="q-my-lg row justify-center" v-if="loader">
            <q-spinner-gears size="50px" color="header" />
        </div>
        <div class="col-12 row justify-center" :class="$q.screen.lt.md ? '' : 'q-ml-lg'" v-if="data.length > 0 && loader === false">
          <q-card
            class="my-card q-ma-md  col-xl-2 col-lg-2 col-md-3 col-sm-11 col-xs-11"
            :class="$q.screen.lt.md ? '' : 'q-mr-lg'"
            v-for="(producto, index) in newProducts"
            :key="index"
            flat
          >
            <q-item :to="{ path: '/detalles', query: { ref: producto.ref }}">
              <q-img
                :src="producto.highlight ? config.api.url + producto.highlight : config.api.url + producto.image[0]"
                height="250px"
                contain
              />
            </q-item>

            <q-card-section class="q-pa-none row justify-center">
              <div class="text-subtitle1 text-bold col-12" style="color:#4b4b4b;">{{producto.name}}</div>
              <div
                style="color:#808080;"
                class="text-caption text-bold col-12"
              ><span v-if="producto.branch">{{producto.branch.name}} ></span> {{producto.category.name}}</div>
              <div style="font-size:10px;color:#808080;" class="col-12 ellipsis">{{producto.description ? producto.description : 'No hay descripcion del producto'}}</div>
              <div class="text-h5 text-bold col-12" style="color:#4b4b4b;">$ {{format(producto.price)}}</div>
              <div class="row justify-between col-12">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
                  <q-btn
                    :to="{ path: '/detalles', query: { ref: producto.ref }}"
                    style="font-size: 12px"
                    color="header"
                    class="full-width text-white"
                    no-caps
                  >
                    <div class="ellipsis">Ver producto</div>
                  </q-btn>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
                  <q-btn
                    style="font-size: 12px"
                    class="full-width text-white"
                    color="header"
                    label="Comprar"
                    no-caps
                    @click="add(producto)"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator class="q-mt-sm" style="height:1px;background-color:#4b4b4b;" />
          </q-card>
        </div>
        <div class="justify-center text-center q-ma-xl" v-else>
          <span>No hay productos disponibles</span>
        </div>
      </div>
    </div>

    <!-- <div class="row justify-center q-ma-sm">
      <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <p class="text-left text-h6" v-if="this.branchExist">Nuestras marcas:</p>
        <brands @branchDontExist="branchDontExist()"></brands>
      </div>
    </div> -->
  </div>
</template>

<script>
import { PRODUCTOS_HOME_QUERY } from "@/graphql/products";
import { ALL_SLIDE_QUERY } from "@/graphql/slide";
import brands from "@/components/components/brands";
import config from "@/config";
export default {
  name: "Home",
  components: {
    brands
  },
  data() {
    return {
      slide: 1,
      data: [],
      config: config,
      loader: false,
      slider: [],
      branchExist: true,
    };
  },
  async created() {
    this.$store.commit('createSessionUserId');
    // this.$store.commit("cartKeys", this.cartKeys);
    this.allProducts();
    this.allSlides()
  },
  computed: {
    hightlight() {
      let hightlight = this.data.filter(a => {
        return a.important
      })
      return hightlight
    },
    newProducts() {
      let datas = this.data.sort((a, b)=> {  
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      return datas.slice(0, 4)
    }
  },
  methods: {
    allProducts() {
      this.loader = true
      return this.$apollo
        .query({
          query: PRODUCTOS_HOME_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllProducts);
          this.data = Object.assign([], response.data.HomeProducts);
          this.loader = false
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    format(input) {
      let num = input
      if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
      }
    },
    allSlides() {
      this.$apollo
        .query({
          query: ALL_SLIDE_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.slider = Object.assign([], response.data.AllSlide);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    branchDontExist() {
      this.branchExist = false
    },
    // getDetail(producto) {
    //   this.$router.push({ name: "detalles", params: producto });
    // },
    add(producto) {
      console.log(producto.name)
      let item = {
        _id: producto._id,
        name: producto.name,
        price: producto.price,
        highlight: producto.highlight,
        image: producto.image,
        model: producto.model ? producto.model : '',
        category: producto.category,
        description: producto.description,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$q.notify({
        message: "Añadido al carrito de compras",
        color: "positive"
      });
    }
  }
};
</script>
