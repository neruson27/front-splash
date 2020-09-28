<template>
  <div class="q-my-md row justify-center">
    <q-card class="q-px-lg q-pb-md q-mx-md col-10" bordered>
        <q-card-section class="row q-pt-x"  :style="$q.screen.lt.md ? 'margin-left: -40px' : ''" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
          <div class="text-h5 q-mt-sm q-mb-lg col-12">Resumen de la compra</div>
          <q-list bordered class="col-11 bg-white rounded-borders">
            <q-item class="row justify-between" v-for="(product,index) in products" :key="index">
              <q-card-section class="col-6">
                <q-img
                  class="rounded-borders q-mr-lg"
                  :src="product.highlight ? config.api.url + product.highlight : config.api.url + product.image[0]"
                  width="100px"
                  height="100px"
                />
                <span><b>{{product.name}}</b> - {{product.branch.name}} {{product.description ? ' | ' + product.description.slice(0,10)+'...' : ''}}</span>
              </q-card-section>

              <q-item-section class="col-6">
                <div class="row justify-end text-grey-8">
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
              </q-item-section>
            </q-item>
            <q-separator />

            <q-card-section class="row">
              <div class="text-center text-subtitle1 col-6">
                <span>Total:</span> 
              </div>
              <div class="text-center col-6">
                <span class="text-h6"><b>{{'$ '}}{{format(total)}}</b></span>
              </div>
            </q-card-section>
          </q-list>
        </q-card-section>

      <q-card-section class="row" :style="$q.screen.lt.md ? 'margin-left: -40px' : ''" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
        <q-list bordered class="row justify-center q-py-lg col-11 bg-white rounded-borders">
          <q-input hide-bottom-space v-model="name" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5 q-mr-sm" label="Nombre o Razon Social"></q-input>
          <q-input hide-bottom-space v-model="dni" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5" label="C.C., Nit., Pasaporte u Otro"></q-input>
          <q-input hide-bottom-space v-model="concept" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5 q-mt-sm q-mr-sm" label="Concepto"></q-input>
          <q-field outlined class="col-5 q-mt-sm" label="Valor a pagar" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0"><span class="text-bold">{{'$ '}}</span>{{format(total)}}</div>
            </template>
          </q-field>
          <q-input hide-bottom-space v-model="tlf" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5 q-mr-sm q-mt-sm" label="Teléfono"></q-input>
          <q-input hide-bottom-space v-model="dir" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5 q-mt-sm" label="Dirección"></q-input>
          <q-input hide-bottom-space v-model="email" :rules="[val => !!val || 'Esto es obligatorio!']" outlined class="col-5 q-mr-sm q-mt-sm" label="Correo"></q-input>
          <div class="col-5 row q-mt-md">
            <!-- <q-btn style="height: 35px" class="col-6 q-mr-sm" no-caps color="whatsapp" label="Pedir por whatsapp" icon-right="img:/statics/img/whatsapp.svg"></q-btn> -->
            <form class="col-5" ref="myform" @click="saveCheckout()"></form>
          </div>
        </q-list>
      </q-card-section>

      <q-card-section class="row" :style="$q.screen.lt.md ? 'margin-left: -40px' : ''" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
        <q-list bordered class="q-pa-lg col-11 bg-white rounded-borders">
          <p class="text-h6">Opciones de pago</p>
          <p>Aceptamos los siguientes metodos de pago:</p>
          <q-img src="statics/img/parte_1.png" spinner-color="white" width="50%" />
          <q-img src="statics/img/parte_2.png" spinner-color="white" width="50%" />
          <br> <br>
          <p>Los metodos de pago disponibles pueden variar segun el tipo de despacho</p>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import config from "@/config"
  export default {
    name: "checkout",
    data() {
      return {
        products: (this.products = this.$store.getters.cart),
        name: '',
        dni: '',
        concept: '',
        tlf: '',
        dir: '',
        email: '',
        config: config
      };
    },
    mounted() {
      console.log(this.products)
      let payconame = `Splash : Compra de ${this.numberOfitemsInCart} articulos`
      let description = ''
      for (let item of this.products) {
        description = `${item.name} [Ctd: ${item.quantity}] ` + description
      }
      console.log(description)
      let foo = document.createElement('script');    
      foo.setAttribute("src","https://checkout.epayco.co/checkout.js")
      foo.setAttribute("class","epayco-button")
      foo.setAttribute("data-epayco-key","3100b99d240564dafc871eda6facf6f0")
      foo.setAttribute("data-epayco-amount", this.total)
      foo.setAttribute("data-epayco-name", payconame)
      foo.setAttribute("data-epayco-description", description)
      foo.setAttribute("data-epayco-currency","cop")
      foo.setAttribute("data-epayco-country","co")
      foo.setAttribute("data-epayco-test","true")
      foo.setAttribute("data-epayco-external","true")
      foo.setAttribute("data-epayco-response","https://perfumesysplash.com/#/response")
      this.$refs.myform.appendChild(foo);
    },
    computed: {
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
          name: producto.name,
          price: producto.price,
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
        console.log('hola')
        let form = {
          name: this.name,
          dni: this.dni,
          total: this.format(this.total),
          concept: this.concept,
          tlf: this.tlf,
          dir: this.dir,
          email: this.email,
        }
        this.$store.commit("setCheckout", form);
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