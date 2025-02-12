export var img = {
    data() {
      return {
        value: "",
      };
    },
    mounted() {
        if (this.modelValue && typeof this.modelValue === "string") {
          this.value = this.parentUrl + "/" + this.modelValue;
        }
      },
    computed: {
      parentUrl() {
        const parent = this.$parent.$parent.$parent.$parent;
        return parent ? parent.url : "";
      },
    },
    methods: {
        change(event) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.value = reader.result;
          };
          this.$emit("update:modelValue", file);
        },
      },
    watch: {
      modelValue(newVal) {
        if (newVal && typeof newVal === "string") {
          this.value = this.parentUrl + "/" + newVal;
        }
        else if (!newVal) {
          this.value = "";
        }
      },
    },
    props: {
      modelValue: String,
    },
    template: `
      <div class="image-preview-area">
        <a href="#" class="select_img" @click.prevent="$refs.input.click()">
            <span v-if="value">
            <img :src="value" :class="['im', 'new-image']">
            </span>
            <span v-else>
            <img :src="parentUrl + '/app/views/images/placeholder.png'" class="im">
            </span>
        </a>
        </div>
        <input 
              type="file" 
              data-name="image" 
              ref="input" 
              accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml" 
              @change="change($event)" 
              class="file-input">
    `,
  };