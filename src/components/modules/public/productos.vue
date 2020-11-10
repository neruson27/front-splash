<template>
  <div class="row justify-center">
    <div class="col-9 q-my-lg">
      <div class="row justify-start">
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12 q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroCategory"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="categories"
            label="Hombre o Mujer"
            clearable
            @clear="clearAll('categoria')"
          />
        </div>
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12 q-ma-sm q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroSubCategory"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="filtroCategory ? filtroCategory.subcategory : subcategories"
            label="Fragancia"
            clearable
            @clear="clearAll('subcategoria')"
          />
        </div>
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12 q-ma-sm q-ma-sm" v-if="branchs.lenght > 1">
          <q-select
            dense
            filled
            v-model="filtroBranch"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="branchs"
            label="Marcas"
            clearable
            @clear="clearAll('branch')"
          />
        </div>
        <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-xs-12 q-ma-sm q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroTag"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="filtroCategory && filtroCategory.tagsgroup[0] ? filtroCategory.tagsgroup[0].tags : tags"
            label="Características"
            clearable
            @clear="clearAll('tags')"
          />
        </div>
        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-5 q-ma-sm text-center">
          <q-btn v-if="botonBuscar" color="negative" @click="allProducts(true)" label="Buscar" />
        </div>
      </div>
    </div>
    <div class="col-xl-10 col-lg-10 col-md-9 col-sm-12 col-xs-12">
      <div class="row justify-center text-center" style="min-height:500px;" v-if="mensaje === true">
        <div class="col-12 self-center">
          <p>{{mensajeError}}</p>
        </div>
      </div>
      <div v-else class="row justify-center">
        <q-dialog v-model="loader" persistent class="row justify-center" transition-show="scale" transition-hide="scale">
          <q-spinner-oval size="200px" color="white" />
        </q-dialog>
        <q-card flat class="col-11 row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'" v-if="data.length > 0">
          <!-- <q-infinite-scroll class="row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'"  @load="load" :offset="$q.screen.lt.md ? 400 : 280"> -->
            <q-card
            class="my-card q-my-md q-px-sm col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12 justify-center"
            v-for="(producto, index) in data"
            :key="index"
            flat
            >
              <q-item :to="{ path: '/detalles', query: { ref: producto.ref }}">
                <q-img
                  :src="producto.highlight ? config.api.url + producto.highlight : config.api.url + producto.image[0]"
                  height="200px"
                  contain
                />
              </q-item>

              <q-card-section class="row justify-center">
                <div class="text-subtitle1 text-bold col-12" style="color:#4b4b4b;">{{producto.name}}</div>
                <div
                  style="color:#808080;"
                  class="text-caption text-bold col-12"
                ><span v-if="producto.branch && producto.branch.name !== null">{{producto.branch.name}} ></span> {{producto.category.name}}</div>
                <div style="font-size:10px;color:#808080;" class="col-12 ellipsis">{{producto.description ? producto.description : 'No hay descripcion del producto'}}</div>
                <div class="text-h5 text-bold col-12" style="color:#4b4b4b;">$ {{format(producto.price)}}</div>
                <div class="row justify-between col-12">
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
                    <q-btn
                      :to="{ path: '/detalles', query: { ref: producto.ref }}"
                      style="font-size: 12px"
                      class="full-width text-white"
                      color="header"
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
          <!-- </q-infinite-scroll> -->
        </q-card>
        <div class="q-ma-xl" v-else>
          <span>{{loader ? "" : "No hay productos disponibles"}}</span>
        </div>
        <div class="col-12 row justify-center q-pa-lg">
          <q-pagination
            v-model="page"
            color="header"
            :max="cantProd"
            :max-pages="4"
            :boundary-numbers="false"
            @input="(value) => allProducts(null,value)"
          >
          </q-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  BRANCH_QUERY,
  SUBCATEGORY_QUERY,
  CATEGORY_QUERY,
  TAG_QUERY,
  PRODUCTOS_QUERY,
  FILTER_PRODUCTS
} from "@/graphql/products";
import config from "@/config";
export default {
  name: "productos",
  data() {
    return {
      config: config,
      data: [],
      dataAll: [],
      filtroCategory: "",
      filtroSubCategory: "",
      filtroBranch: "",
      filtroTag: "",
      tags: [],
      branchs: [],
      subcategories: [],
      selectSubcategory: false,
      selectBranch: false,
      botonBuscar: false,
      mensaje: false,
      categories: [],
      loader: true,
      fin: false,
      page: 1,
      cantProd: 0,
      mensajeError: "",
    };
  },
  async created() {
    let funciones = [
      this.allBranchs(),
      this.allSubcategories(),
      this.allProducts(),
      this.allCategories(),
      this.allTags()
    ];
    await this.loading(funciones);
    if (this.$route.query.search) {
      this.searchProducto(this.$route.query.search);
    }
  },
  watch: {
    "$route.query": function(newValue) {
      console.log("watch funcioann");
      console.log(newValue);
      if (newValue.search) this.searchProducto(newValue.search);
      else if (this.$route.name === "productos")
        this.data = Object.assign([], this.dataAll);
    },
    filtroCategory(newValue) {
      if (this.filtroCategory) {
        return (this.botonBuscar = true);
      }
    },
    filtroSubCategory(newValue) {
      if (this.filtroSubCategory) {
        return (this.botonBuscar = true);
      }
    },
    filtroBranch(newValue) {
      if (this.filtroBranch) {
        return (this.botonBuscar = true);
      }
    },
    filtroTag(newValue) {
      if (this.filtroTag) {
        return (this.botonBuscar = true);
      }
    }
  },
  methods: {
    allCategories() {
      return this.$apollo
        .query({
          query: CATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllCategories);
          this.categories = Object.assign([], response.data.AllCategories);
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
    allTags() {
      return this.$apollo
        .query({
          query: TAG_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllTags);
          this.tags = Object.assign([], response.data.AllTags);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    allProducts(button,value) {
      if(button){
        this.data = []
        this.page = 1
        this.fin = false
      } 
      let pagination = {
        page: value ? value : this.page,
        limit: 16
      }
      console.log(pagination)
      let filter = {}
      this.loader = true
      if(this.filtroCategory) filter['categoria'] = this.filtroCategory.name
      if(this.filtoSubCategory) filter['subcategoria'] = this.filtroSubCategory.name
      if(this.filtroTag) filter['tags'] = this.filtroTag.name
      if(this.filtroBranch) filter['brach'] = this.filtroBranch.name
      return this.$apollo
        .query({
          query: PRODUCTOS_QUERY,
          variables: {
            pagination: pagination,
            filter: filter
          },
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllProducts);
          if(response.data.AllProducts.length === 0) this.fin = true
          this.data = response.data.AllProducts.product
          this.page = response.data.AllProducts.pagination.page
          this.cantProd = response.data.AllProducts.pagination.pages
          this.dataAll = Object.assign([], response.data.AllProducts);
          this.mensajeError = "No hubo coincidencias en la busqueda"
          this.loader = false
        })
        .catch(err => {
          console.log("hubo un error: ", err);
          this.loader = false
        });
    },
    // async load(index, done) {
    //   if (!this.fin) {
    //     this.page = this.page+1
    //     this.loader = true
    //     await this.allProducts()
    //   }
    //   done()
    // },
    searchProducto(search) {
      console.log(search);
      this.data = Object.assign([], this.dataAll);
      this.data = this.data.filter(
        dat => dat.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
      if (this.data.length === 0) {
        this.mensaje = true;
      } else {
        this.mensaje = false;
      }
    },
    clearAll(whichInput) {
      console.log("erase");
      switch(whichInput){
        case "category":
          this.filtroCategory = "";
        break;
        case "subcategory":
          this.filtroSubCategory = "";
        break;
        case "tags":
          this.filtroTag = "";
        break;
        case "brach":
          this.filtroBranch = "";
        break;
      }
      console.log(!this.filtroCategory)
      console.log(!this.filtroSubCategory)
      console.log(!this.filtroTag)
      if(!this.filtroCategory && !this.filtroSubCategory && !this.filtroTag){
        console.log("elwebomioestaprendiocomounsopletelollama")
        this.botonBuscar = false
      } 
      this.mensaje = false;
      this.allProducts(true)
    },
    add(producto) {
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
    },
    allBranchs() {
      return this.$apollo
        .query({
          query: BRANCH_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.branchs = Object.assign([], response.data.AllBranchs);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    allSubcategories() {
      return this.$apollo
        .query({
          query: SUBCATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.subcategories = Object.assign(
            [],
            response.data.AllSubcategories
          );
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    async loading(callbacks) {
      this.loader = true;
      for (let callback of callbacks) {
        await callback;
      }
      this.loader = false;
      return this.loader;
    }
  }
};
</script>
