<template>
  <div class="row justify-center">
    <div class="col-10">
      <div class="q-pa-md">
        <q-table
          grid
          :pagination.sync="initialPagination"
          :grid-header="!$q.screen.lt.md"
          :dense="$q.screen.lt.md"
          :data="taxes"
          :columns="columns"
          row-key="asc"
          :filter="filter"
          :rows-per-page-options="perPage"
        >
          <template v-slot:top-right>
            <q-btn
              label="Agregar precio de envio"
              icon="mdi-plus"
              flat
              color="vinotinto"
              @click="createNew()"
            >
            </q-btn>
          </template>
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card class="bg-header logo text-white">
                <q-card-section class="row flex flex-center" @click="handler(props.row)">
                    <p class="text-subtitle1 col-12">Precio de envio</p>
                    <p class="text-subtitle2 col-12">$ {{format(props.row.tax)}}</p>
                    <q-img src="@/statics/img/logo_1.svg" style="width:40px" class="absolute-bottom-right q-ma-sm"/>
                </q-card-section>
                    <q-btn
                      @click="deleteTax(props.row._id)"
                      flat
                      round
                      color="vinotinto"
                      icon="mdi-delete"
                      class="absolute-top-right q-pa-sm"
                    >
                      <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]"
                        >Eliminar</q-tooltip
                      >
                    </q-btn>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog v-model="newTaxDialog">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Nuevo Precio de envio</div>
        </q-card-section>

        <q-card-section class="q-pt-sm justify-center">
          <q-toggle v-model="boolDefault" color="blue" label="Precio general" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            autofocus
            dense
            type="number"
            v-model="precioEnvioNew"
            hint="Precio de envio"
            v-on:keyup.enter="nuevoPrecioDeEnvio"
          >
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat dense color="negative" icon="cancel" v-close-popup />
          <q-btn
            flat
            dense
            color="positive"
            icon="check_circle"
            @click="nuevoPrecioDeEnvio"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="ordenDetalle">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row" style="background-color: #f7f8fb">
          <p class="col-6">
            Precio de envio {{ detalle.defaultTax ? "general" : "" }}:
            <q-btn flat @click="changeValue(detalle.tax)">
              {{ detalle.tax }}
              <q-popup-edit v-model="precioEnvioEdit">
                <template
                  v-slot="{ initialValue, value, emitValue, validate, cancel }"
                >
                  <q-input
                    autofocus
                    dense
                    type="number"
                    :value="precioEnvioEdit"
                    hint="Precio de envio"
                    @input="emitValue"
                    v-on:keyup.enter="editPrecioDeEnvio(detalle._id)"
                  >
                    <template v-slot:after>
                      <q-btn
                        flat
                        dense
                        color="negative"
                        icon="cancel"
                        @click.stop="cancel"
                      />
                      <q-btn
                        flat
                        dense
                        color="positive"
                        icon="check_circle"
                        @click.stop="editPrecioDeEnvio(detalle._id)"
                        :disable="
                          validate(value) === false || initialValue === value
                        "
                      />
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </q-btn>
          </p>
          <q-select
            :disable="detalle.defaultTax"
            class="col-6"
            hide-bottom-space
            dense
            v-model="newCiudad"
            :options="departamentosItem"
            emit-value
            map-options
            label="Departamento:"
          >
          </q-select>
          <div class="col-6"></div>
          <q-select
            class="col-6 justify-end row"
            hide-bottom-space
            dense
            :disable="!selectCiudades"
            v-model="newCities"
            :options="citiesItem"
            emit-value
            map-options
            label="Ciudades:"
          >
          </q-select>
        </q-card-section>
        <q-markup-table v-if="detalle.cities && detalle.cities.length > 0">
          <thead>
            <tr>
              <th class="text-center">Departamento</th>
              <th class="text-center">Ciudad</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(city, index) in detalle.cities" :key="index">
              <td class="text-center">{{ city.departamento }}</td>
              <td class="text-center">{{ city.name }}</td>
              <td class="text-center">
                <q-btn
                  @click="deleteCities(detalle._id, city._id)"
                  flat
                  round
                  color="vinotinto"
                  icon="mdi-delete"
                >
                  <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]"
                    >Eliminar</q-tooltip
                  >
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card-actions
          class="row justify-between q-pt-md q-pb-sm"
          style="background-color: #f7f8fb"
        >
          <q-btn
            class="col-2"
            v-if="newCities !== ''"
            flat
            label="Nueva Ciudad"
            color="header"
            @click="updateCitiesTax(detalle)"
          />
          <q-btn
            class="col-2"
            flat
            label="Cerrar"
            color="negative"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogEliminar">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Desea Eliminar este precio?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat dense color="negative" icon="cancel" v-close-popup />
          <q-btn
            flat
            dense
            color="positive"
            icon="check_circle"
            @click="deleteTax"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import config from "@/config";
import ciudades from "@/utils/ciudades";
import {
  NEW_PRECIO_ENVIO,
  ALL_TAX,
  UPD_PRECIO_ENVIO,
  DEL_CITIES_TAX,
  DEL_TAX
} from "@/graphql/cities";
export default {
  name: "ciudades",
  components: {},
  data() {
    return {
      taxes: [],
      config: config,
      ordenDetalle: false,
      selectCiudades: false,
      departamentosItem: [],
      citiesItem: [],
      detalle: [],
      boolDefault: false,
      errorMensajeBool: false,
      newTaxDialog: false,
      dialogEliminar: false,
      precioEnvioEdit: 0,
      idEliminar: '',
      errorMensaje: "",
      newCiudad: "",
      newCities: "",
      precioEnvioNew: 0,
      filter: "",
      initialPagination: {
        sortBy: "desc",
        descending: true,
        rowsPerPage: 3,
      },
      perPage: [],
      columns: [
        {
          name: "asc",
          label: "Tax",
          align: "center",
          field: (row) => row.tax,
        },
        { name: "actions", align: "left", label: "Acciones", field: "actions" },
      ],
      updating: false,
    };
  },
  created() {
    this.allTax();
    this.makeSelect();
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
  watch: {
    newCiudad(value) {
      if (value !== "") {
        this.citiesItem = [];
        this.mapeoCiudad(value);
      }
    },
  },
  methods: {
    deleteTax(id) {
      if(this.dialogEliminar){
        return this.$apollo
          .mutate({
            mutation: DEL_TAX,
            variables: {
              id: this.idEliminar,
            },
          })
          .then((response) => {
            this.allTax();
            this.dialogEliminar = false
            this.idEliminar = ''
            this.$q.notify({
              message: "Borrado con exito",
              color: "positive",
            });
          })
          .catch((err) => {
            console.log("error: ", err);
          });
      } else {
        this.dialogEliminar = true
        this.idEliminar = id
      }
    },
    createNew() {
      this.newTaxDialog = true;
    },
    editPrecioDeEnvio(id) {
      if (this.precioEnvioEdit == 0) {
        this.$q.notify({
          message: "Este campo no se puede enviar vacio",
          color: "negative",
        });
      }
      let data = {
        tax: parseFloat(this.precioEnvioEdit),
      };
      return this.$apollo
        .mutate({
          mutation: UPD_PRECIO_ENVIO,
          variables: {
            id: id,
            data: data,
          },
        })
        .then((response) => {
          this.allTax();
          this.clearAll();
          this.$q.notify({
            message: "Editado con exito",
            color: "positive",
          });
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    changeValue(value) {
      this.precioEnvioEdit = value;
    },
    deleteCities(id, idCities) {
      return this.$apollo
        .mutate({
          mutation: DEL_CITIES_TAX,
          variables: {
            id: id,
            idCities: idCities,
          },
        })
        .then((response) => {
          this.allTax();
          this.clearAll();
          this.$q.notify({
            message: "Borrado con exito",
            color: "positive",
          });
        })
        .catch((err) => {
          console.log("error CATEGORY: ", err);
        });
    },
    mapeoCiudad(value) {
      let cant = 0;
      ciudades.map((item) => {
        if (item.id === value) {
          item.ciudades.map((item) => {
            let thing = {
              value: cant,
              label: item,
            };
            this.citiesItem.push(thing);
            cant++;
          });
        }
      });
      this.selectCiudades = true;
    },
    makeSelect() {
      ciudades.map((item) => {
        let thing = {
          value: item.id,
          label: item.departamento,
        };
        this.departamentosItem.push(thing);
      });
    },
    updateCitiesTax(detalle) {
      let labelDepartment;
      let labelCity;
      let nplus = 0;
      ciudades.map((item) => {
        if (item.id === this.newCiudad) {
          labelDepartment = item.departamento;
          item.ciudades.map((item) => {
            if (nplus === this.newCities) {
              labelCity = item;
            }
            nplus++;
          });
        }
      });
      detalle.cities.forEach((item) => {
        if (item.name == labelCity) {
          this.errorMensaje = "No se puede ingresar nuevamente esta ciudad";
          this.errorMensajeBool = true;
          this.clearAll();
        }
      });
      if (this.errorMensajeBool) {
        this.errorMensajeBool = false;
        this.$q.notify({
          message: this.errorMensaje,
          color: "negative",
        });
        return;
      }
      let datos = {
        name: labelCity,
        departamento: labelDepartment,
      };
      let data = {
        tax: detalle.tax,
        cities: datos,
      };
      return this.$apollo
        .mutate({
          mutation: UPD_PRECIO_ENVIO,
          variables: {
            id: detalle._id,
            data: data,
          },
        })
        .then((response) => {
          this.allTax();
          this.clearAll();
          this.$q.notify({
            message: "Creado con exito",
            color: "positive",
          });
        })
        .catch((err) => {
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative",
          });
          console.log("error: ", err);
        });
    },
    nuevoPrecioDeEnvio() {
      if (!parseFloat(this.precioEnvioNew) > 0) {
        this.$q.notify({
          message: "El precio de envio debe ser mayor que 0",
          color: "negative",
        });
      }
      let data = {
        tax: parseFloat(this.precioEnvioNew),
      };
      if (this.boolDefault) data["defaultTax"] = true;
      return this.$apollo
        .mutate({
          mutation: NEW_PRECIO_ENVIO,
          variables: {
            data: data,
          },
        })
        .then((response) => {
          this.allTax();
          this.$q.notify({
            message: "Creado con exito",
            color: "positive",
          });
          this.newTaxDialog = false;
          this.boolDefault = false;
          this.precioEnvioNew = 0
        })
        .catch((err) => {
          console.log("error CATEGORY: ", err);
        });
    },
    allTax() {
      return this.$apollo
        .query({
          query: ALL_TAX,
          fetchPolicy: "network-only",
        })
        .then((response) => {
          this.taxes = response.data.AllTax;
        })
        .catch((err) => {
          console.log("hubo un error: ", err);
        });
    },
    format(input) {
      let num = input;
      if (!isNaN(num)) {
        num = num
          .toString()
          .split("")
          .reverse()
          .join("")
          .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
        num = num.split("").reverse().join("").replace(/^[\.]/, "");
        return num;
      }
    },
    handler(props) {
      this.ordenDetalle = true;
      this.detalle = props;
    },
    clearAll() {
      this.ordenDetalle = false;
      this.selectCiudades = false;
      this.newCiudad = "";
      this.newCities = "";
    },
  },
};
</script>