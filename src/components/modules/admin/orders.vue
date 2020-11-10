<style>
.logo {
  background-image: url('/statics/img/logo_1.svg');
  background-repeat: no-repeat;
  background-size: 5em;
  background-position: 90% 5%;
}
</style>
<template>
  <div class="row justify-center">
    <div class="col-10">
      <div class="q-pa-md">
        <q-table
          grid
          :pagination.sync="pagination"
          :grid-header="!$q.screen.lt.md"
          :dense="$q.screen.lt.md"
          :data="orders"
          :columns="columns"
          card-class="bg-header logo text-white"
          row-key="asc"
          :filter="filter"
          hide-header
          @request="onRequest"
          binary-state-sort
          @row-click="(evt, row) => handler(row)"
        >
          <!-- <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template> -->
        </q-table>
      </div>
    </div>
    <q-dialog full-width v-model="ordenDetalle">
      <q-card>
        <q-card-section class="row" style="background-color:#f7f8fb">
          <p class="text-h6 col-10">Detalle de la orden</p>
          <!-- <span class="text-right col-2" :class="detalle.status === 'Por Despachar' ? 'text-negative':'text-positive'">{{detalle.status}}</span> -->
          <q-select
            class="text-right col-2"
            hide-bottom-space
            borderless
            dense
            v-model="detalle.status"
            :options="status"
            @input="(value) => updateOrdersStatus(detalle._id, value)"
            label="Estatus:"
          >
            <template v-slot:selected-item="scope">
              <span :class="scope.opt === 'Despachado' ? 'text-positive':'text-negative'">{{scope.opt}}</span>
            </template>
          </q-select>
          <p class="col-4 text-weight-thin"># de orden: {{detalle.orderNumber}}</p>
          <p class="col-8 text-right text-bold">Ref payco: {{detalle.ref_payco}}</p>
        </q-card-section>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left" style="background-color:#f7f8fb"></th>
              <th class="text-right">Nombre</th>
              <th class="text-right">Descripcion</th>
              <!-- <th class="text-right">Marca</th> -->
              <!-- <th class="text-right">Modelo</th> -->
              <th class="text-right">Categoria</th>
              <th class="text-right">Subcategoria</th>
              <th class="text-right">Ref</th>
              <th class="text-right">Precio</th>
              <th class="text-right">Ctd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in detalle.products" :key="index">
              <td class="text-right bg-dark">
                <q-img
                  :src="producto.hightlight ? config.api.url + producto.hightlight : 'statics/img/logo_1.svg'"
                  spinner-color="black"
                  height="100px"
                  width="100px"
                  contain
                />
              </td>
              <td class="text-right">{{producto.name}}</td>
              <td class="text-right">{{producto.description}}</td>
              <!-- <td class="text-right">{{producto.branch ? producto.branch.name : ''}}</td> -->
              <!-- <td class="text-right">{{producto.model ? producto.model : ''}}</td> -->
              <td class="text-right">{{producto.category.name}}</td>
              <td class="text-right">{{producto.subcategory.name}}</td>
              <td class="text-right">{{producto.ref}}</td>
              <td class="text-right">$ {{format(producto.price)}}</td>
              <td class="text-right">{{producto.quantity}}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card-actions class="row justify-between q-pt-md q-pb-sm" style="background-color:#f7f8fb">
          <span class="col-3 text-left">{{new Date(detalle.createdAt).toString().slice(0,24)}}</span>
          <q-btn class="col-2" flat label="Cerrar" color="negative" v-close-popup />
          <span class="col-3 text-right">Total: $ {{format(detalle.price)}} COP</span>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import config from "@/config";
import {
  ALL_ORDER_QUERY,
  ONE_ORDER_QUERY,
  ORDER_STATUS_UPDATE,
  ORDER_DELETE
} from "@/graphql/orders";
export default {
  name: "categorias",
  components: {},
  data() {
    return {
      orders: [],
      config: config,
      ordenDetalle: false,
      status: ["Despachado", "Por Despachar", "Orden Invalida"],
      detalle: [],
      filter: "",
      page: 1,
      initialPagination: {
        sortBy: "asc",
        descending: true,
        rowsPerPage: 3
      },
      pagination: {
        page: 1,
        rowsPerPage: 4,
        rowsNumber: 4
      },
      perPage: [],
      columns: [
        {
          name: "asc",
          required: true,
          label: "Orden Nª",
          align: "center",
          field: row => row.orderNumber,
          format: val => `000${val}`,
          sortable: true
        },
        {
          name: "ref_payco",
          label: "ePayco Ref:",
          field: "ref_payco",
          sortable: true
        },
        {
          name: "products",
          label: "Ctd de productos:",
          field: row => row.products,
          format: val => val.length
        },
        { name: "status", label: "Estado:", field: "status" },
        {
          name: "price",
          label: "Valor:",
          field: "price",
          format: val => `$ ${this.format(val)}`
        }
      ],
      updating: false
    };
  },
  created() {
    this.onRequest();
    // this.allOrders();
    if (this.$q.screen.lt.md) {
      this.initialPagination.rowsPerPage = 6;
      this.perPage.push(6, 12, 18, 24, 30, 36);
    } else {
      this.initialPagination.rowsPerPage = this.$q.screen.lt.lg ? 3 : 4;
      this.$q.screen.lt.lg
        ? this.perPage.push(3, 6, 9, 12, 15, 18)
        : this.perPage.push(4, 8, 12, 16, 20, 24);
    }
  },
  computed: {
    pagesNumber() {
      return Math.ceil(this.orders.length / this.pagination.rowsPerPage);
    },
  },
  methods: {
    onRequest(props){
      const { page, rowsPerPage } = props ? props.pagination : this.pagination      

      let paginate = {
        page: page,
        limit: rowsPerPage
      }
      this.allOrders(paginate)
    },
    allOrders(paginate) {
      let filter = {}
      this.$apollo
        .query({
          query: ALL_ORDER_QUERY,
          variables: {
            pagination: paginate,
            filter: filter
          },
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.orders = Object.assign([], response.data.AllOrders.orders);
          this.pagination.page = response.data.AllOrders.pagination.page;
          this.pagination.rowsPerPage = response.data.AllOrders.pagination.limit;
          this.pagination.rowsNumber = response.data.AllOrders.pagination.total;
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteOrder(categoryID) {
      this.$apollo
        .mutate({
          mutation: ORDER_DELETE,
          variables: {
            categoryId: categoryID
          }
        })
        .then(response => {
          var vm = this;
          this.categories.some(function(category, index) {
            if (category.id === categoryID) {
              vm.categories.splice(index, 1);
            }
          });
          this.allCategories();
        })
        .catch(err => {
          console.log("error delete CATEGORY: ", err);
        });
    },
    updateOrdersStatus(id, status) {
      return this.$apollo
        .mutate({
          mutation: ORDER_STATUS_UPDATE,
          variables: {
            id: id,
            status: status
          }
        })
        .then(response => {
          console.log(response);
          this.allOrders();
        })
        .catch(err => {
          console.log("error CATEGORY: ", err);
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
    handler(props) {
      this.ordenDetalle = true;
      this.detalle = props;
    }
  }
};
</script>