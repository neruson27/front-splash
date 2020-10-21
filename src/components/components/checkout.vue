<template>
  <div class="q-my-md row justify-center">
    <q-card class="q-px-lg q-pb-md q-mx-md col-10" bordered>
        <q-card-section class="row q-pt-x" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
          <div class="text-h5 q-mt-sm q-mb-lg col-12" :class="$q.screen.lt.md ? 'text-center' : ''">Resumen de la compra</div>
          <q-list bordered class="col-11 bg-white rounded-borders">
            <div class="row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-between'" v-for="(product,index) in products" :key="index">
              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 row q-pa-lg" :class="$q.screen.lt.md ? 'justify-center' : ''">
                <q-img
                  class="rounded-borders col-lg-6 col-md-6 col-sm-12 col-xs-12"
                  :class="$q.screen.lt.md ? '' : 'q-mr-lg'"
                  :src="product.highlight ? config.api.url + product.highlight : config.api.url + product.image[0]"
                  width="100px"
                  height="100px"
                />
                <span class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-my-lg" :class="$q.screen.lt.md ? 'text-center' : ''"><b>{{product.name}}</b> {{product.branch ? ' - ' + product.branch.name : ''}} {{product.description ? ' | ' + product.description.slice(0,10)+'...' : ''}}</span>
              </div>

              <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div class="row text-grey-8" :class="$q.screen.lt.md ? 'justify-center q-mb-md' : ' justify-end q-my-lg q-pa-lg'">
                  <span class="q-mr-md"><b>Unidades: </b><q-btn
                  outline
                  class="text-black no-pointer-events"
                  color="white"
                  size="xs"
                  :label="product.quantity"
                  ></q-btn></span>
                  <span class="q-mr-md"><b>Total: </b><q-btn
                  outline
                  class="text-black no-pointer-events"
                  color="white"
                  size="xs"
                  :label="'$ ' + format(product.quantity*product.price)"
                  ></q-btn></span>
                  <div>
                    <q-btn size="12px" color="positive" flat dense round icon="mdi-plus" @click="add(product)"/>
                    <q-btn size="12px" color="negative" flat dense round icon="mdi-minus" @click="del(product)"/>
                    <q-btn size="12px" color="grey-5" flat dense round icon="mdi-delete" @click="deleted(product, product.quantity)"/>
                  </div>
                </div>
              </div>
            </div>
            <q-separator />

            <q-card-section class="row">
              <div class="text-center text-subtitle1 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <span>Total:</span> 
              </div>
              <div class="text-center col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <span class="text-h6"><b>{{'$ '}}{{format(total)}}</b></span>
              </div>
            </q-card-section>
          </q-list>
        </q-card-section>

      <q-card-section class="row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
        <q-list bordered class="row justify-center q-py-lg col-lg-11 col-md-11 col-sm-12 col-xs-12 bg-white rounded-borders">
          <q-input hide-bottom-space v-model="name" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Nombre o Razon Social"></q-input>
          <q-input hide-bottom-space v-model="dni" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 " :class="$q.screen.lt.md ? 'q-mb-sm q-mt-sm' : 'q-mr-sm'" label="C.C., Nit., Pasaporte u Otro"></q-input>
          <q-field outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Concepto" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{concept}}</div>
            </template>
          </q-field>
          <q-field outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Valor a pagar" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0"><span class="text-bold">{{'$ '}}</span>{{format(total)}}</div>
            </template>
          </q-field>
          <q-input hide-bottom-space v-model="city" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Ciudad"></q-input>
          <q-input hide-bottom-space v-model="dir" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Dirección"></q-input>
          <q-input hide-bottom-space v-model="tlf" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Teléfono"></q-input>
          <q-input :debounce="400" hide-bottom-space v-model="email" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" label="Correo"></q-input>
          <div class="col-12 row q-mt-md justify-end">
            <!-- <q-btn style="height: 35px" class="col-3 q-mr-sm" no-caps color="whatsapp" label="Pedir por whatsapp" icon-right="img:/statics/img/whatsapp.svg"></q-btn> -->
            <form class="col-lg-3 col-md-3 col-sm-12 col-xs-12" :class="$q.screen.lt.md ? 'q-mb-sm' : 'q-mr-sm'" ref="myform" @click="saveCheckout()"></form>
          </div>
        </q-list>
      </q-card-section>
      <q-card-section class="row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
        <q-list bordered class="q-pa-lg col-lg-11 col-md-11 col-sm-12 col-xs-12 bg-white rounded-borders">
          <p class="text-h6">Opciones de pago</p>
          <p>Aceptamos los siguientes metodos de pago:</p>
          <q-img src="statics/img/parte_1.png" spinner-color="white" :width="$q.screen.lt.md ? '100%' : '50%'" />
          <q-img src="statics/img/parte_2.png" spinner-color="white" :width="$q.screen.lt.md ? '100%' : '50%'" />
          <br> <br>
          <p>Los metodos de pago disponibles pueden variar segun el tipo de despacho</p>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>  
  import { CREATE_ORDER, NUM_ORDER } from "@/graphql/orders";
  import config from "@/config"
  export default {
    name: "checkout",
    data() {
      return {
        products: (this.products = this.$store.getters.cart),
        name: '',
        dni: '',
        tlf: '',
        dir: '',
        email: '',
        city: '',
        response: '',
        config: config
      };
    },
    mounted() {
      
    },
    computed: {
      concept() {
        let products = this.products
        let description
        for (let item of products) {
          description = `${item.name} [Ctd: ${item.quantity}] ` + (description ? description : '')
        }
        return description
      },
      total() {
        return this.products.reduce((total, p) => {
          return total + p.price * p.quantity;
        }, 0);
      },
      numberOfitemsInCart() {
        let cart = this.$store.getters.cart;
        return cart.reduce((accum, item) => accum + item.quantity, 0);
      },
    },
    watch: {
      async email(newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
        
      },
      async name (newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
    },
    async dni (newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
        
    },
    async city (newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
        
    },
    async tlf (newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
        
    },
    async dir (newValue) {
        if (this.name && this.dni && this.city && this.tlf && this.dir && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(this.email)) {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
            }
            if(this.$refs.myform.childNodes[1]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[1])
            }
            if(this.$refs.myform.childNodes[2]) {
              this.$refs.myform.removeChild(this.$refs.myform.childNodes[2])
            }
          }
          this.btnReady()
        } else {
          if(this.$refs.myform.hasChildNodes()) {
            if(this.$refs.myform.childNodes[0]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[0]);
            if(this.$refs.myform.childNodes[1]) this.$refs.myform.removeChild(this.$refs.myform.childNodes[1]);
          }
        }
        
      },
    },
    methods: {
      format(input) {
        let num = input
        if (!isNaN(num)) {
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');
          return num;
        }
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
      saveCheckout() {
        let form = {
          name: this.name,
          dni: this.dni,
          total: this.format(this.total),
          concept: this.concept,
          tlf: this.tlf,
          city: this.city,
          dir: this.dir,
          email: this.email,
        }
        let productsReduce = []
        this.$store.commit("setCheckout", form);

        this.products.forEach(product => {
          productsReduce.push({
            _id: product._id,
            quantity: product.quantity
          })
        });

        let data = {
          id_buyer: String(this.$store.state.id_buyer),
          products: productsReduce,
          checkout: this.$store.state.checkout,
          price: this.total,
        };
        return this.$apollo
          .mutate({
            mutation: CREATE_ORDER,
            variables: {
              data
            }
          })
          .then(response => {
            console.log(response);
            this.$store.commit("empty")
            this.$store.commit("emptyCheckout")
          })
          .catch(err => {
            console.log("hubo un error: ", err);
          });
      },
      async btnReady(){
        let payconame = `Splash : Compra de ${this.numberOfitemsInCart} articulos`
        if(this.$refs.myform.childNodes[0]) {
          this.$refs.myform.removeChild(this.$refs.myform.childNodes[0])
        }  
        this.response = `https://perfumesysplash.com/#/response?id_buyer=${this.$store.state.id_buyer}&`
        let foo = document.createElement('script');  
        foo.setAttribute("src","https://checkout.epayco.co/checkout.js")
        foo.setAttribute("class","epayco-button")
        foo.setAttribute("data-epayco-key","3100b99d240564dafc871eda6facf6f0")
        foo.setAttribute("data-epayco-amount", this.total)
        foo.setAttribute("data-epayco-name", payconame)
        foo.setAttribute("data-epayco-description", this.concept)
        foo.setAttribute("data-epayco-currency","cop")
        foo.setAttribute("data-epayco-country","co")
        foo.setAttribute("data-epayco-test","true")
        foo.setAttribute("data-epayco-external","true")
        foo.setAttribute("data-epayco-response",this.response)
        this.$refs.myform.appendChild(foo);
      },
      del(product, quantity = 1) {
        this.$store.commit("delItem", {
          itemKeys: { name: product.name },
          quantity: quantity
        });
        this.$q.notify({
          message: "Eliminado del carrito de compras",
          color: "negative"
        });
      },
      deleted(product, quantity) {
        this.$store.commit("delItem", {
          itemKeys: { name: product.name },
          quantity: quantity
        });
        this.$q.notify({
          message: "Eliminado del carrito de compras",
          color: "negative"
        });
      },
    }
  }
</script>