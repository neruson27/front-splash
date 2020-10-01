<template>
  <div class="row justify-center q-py-lg q-my-lg">
    <!-- <p class="text-h4">{{response ? 'Compra Realizada con exito!' : 'Error!'}}</p> -->
    <div class="col-10 text-center">
      <span v-if="response"><q-icon size="100px" name="mdi-check-circle-outline" color="positive"></q-icon> <b class="text-h6">Transacción Aprobada</b></span>
      <span v-else><q-icon size="100px" name="mdi-close-circle-outline" color="negative"></q-icon> <b class="text-h6">Transacción Rechazada</b></span>
    </div>
    <div class="col-8 row justify-start">
      <div class="col-10">
        <span class="text-bold text-h6" v-if="response">Orden Numero {{numorder}}</span>
        <p class="q-mt-sm">
          <span class="text-h6">a nombre de:</span><br/>
          <span>{{checkout.name}}</span><br/>
          <span>{{checkout.dni}}</span><br/>
          <span>{{checkout.tlf}}</span><br/>
          <span>{{checkout.city}}</span><br/>
          <span>{{checkout.dir}}</span><br/>
          <span>{{email}}</span><br/>
          <p class="q-mb-none" style=""><b>Por valor de:</b></p>
          <span class="text-h6"><b>{{'$ '}}{{format(total)}}</b></span>
        </p>
      </div>
    </div>
    <div class="col-8 row justify-center text-center" v-if="response">
      <div>
        <q-icon size="100px" color="positive" name="mdi-truck-fast-outline"></q-icon>
      </div>
      <div class="q-mt-md q-ml-sm">
        <p class="q-mb-none text-h6">Gracias por tu compra</p>
        <p class="q-mt-none text-h6">Tu envió va en camino! </p>
      </div>
    </div>
    <div class="col-8 row justify-center text-center" v-else>
      <div>
        <q-icon size="100px" name="mdi-alert-circle" color="negative"></q-icon>
      </div>
      <div class="text-justify">
        <p class="q-mb-none text-h6">Tu transacción ha sido rechazada </p>
        <p class="q-mb-none text-h6">Intentalo nuevamente! </p>
        <p class="q-mb-none text-h6">Si el problema persiste comunícate con tu entidad bancaria </p>
      </div>
    </div>
    <p class="col-8 q-mt-md" v-if="response">Hemos enviado un correo electrónico con esta información. </p>
  </div>
</template>

<script>
  import { CREATE_ORDER, NUM_ORDER } from "@/graphql/orders";
  export default {
    name: "checkout",
    data() {
      return {
        products: (this.products = this.$store.getters.cart),
        checkout: (this.checkout = this.$store.state.checkout),
        response: '',
        numorder: 0
      };
    },
    async created() {
      console.log(this.$route.query.ref_payco)
      await this.numOrder()
      this.response = this.$route.query.ref_payco
      if(this.response) {
        setTimeout(this.createOrder(), 1000)
      }
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
      createOrder() {
        let data = {
          ref_payco: this.response,
          products: this.products,
          checkout: this.checkout,
          price: this.total,
        };
        this.$apollo
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
      numOrder() {
        return this.$apollo
          .query({
            query: NUM_ORDER,
            fetchPolicy: "network-only"
          })
          .then(res => {
            console.log(res)
            this.numorder = '0000' + (res.data.NumOrders + 1)
          })
          .catch(err => {
            console.log(err)
          })
      },
      format(input) {
        let num = input
        if (!isNaN(num)) {
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');
          return num;
        }
      },
    }
  }
</script>