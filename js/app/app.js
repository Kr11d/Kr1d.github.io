import { router } from "./router.js";
import { msg } from "./widgets/msg.js";
import { popup } from "./widgets/popup.js";
import { header } from "./widgets/header.js";
import { toogle } from "./widgets/toogle.js";
import { img } from "./widgets/img.js";


document.addEventListener("DOMContentLoaded", function () {
    const main = {
        data() {
            return {
                url: "https://affiliate.yanbasok.com",
                user: {
                    name: "",
                    phone: "",
                    email: "",
                    date: "",
                    auth: "",
                },
                formData: {},
                title: "",
                date: "",
                time: "",
            };
        },
        watch: {
            $route() {
                this.init();
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const self = this;

                if (window.localStorage.getItem("user")) {
                    self.user = JSON.parse(window.localStorage.getItem("user"));
                }

                router.isReady().then(() => {
                    if (window.localStorage.getItem("user")) {
                        self.user = JSON.parse(
                            window.localStorage.getItem("user")
                        );

                        if (
                            self.$route.path === "/" &&
                            self.user.type === "admin"
                        ) {
                            self.page("/campaigns");
                        } else if (
                            [
                                "/campaigns",
                                "/campaign",
                                "/users",
                                "/user",
                            ].includes(self.$route.path) &&
                            self.user.type !== "admin"
                        ) {
                            self.page("/statistics");
                        } else if (
                            ["/statistics", "/payments", "/sites"].includes(
                                self.$route.path
                            ) &&
                            self.user.type === "admin"
                        ) {
                            self.page("/campaigns");
                        } else if (
                            [
                                "/campaigns",
                                "/campaign",
                                "/users",
                                "/user",
                                "/statistics",
                                "/payments",
                                "/sites",
                            ].includes(self.$route.path)
                        ) {
                            self.page();
                        } else if (
                            ![
                                "/campaigns",
                                "/campaign",
                                "/users",
                                "/user",
                                "/statistics",
                                "/payments",
                                "/sites",
                            ].includes(self.$route.path)
                        ) {
                            self.page();
                        }
                    } else {
                        self.page("/");
                    }
                });
            },

            logout() {
                this.user = {
                    name: "",
                    phone: "",
                    email: "",
                    date: "",
                    auth: "",
                };
                this.page("/");
                window.localStorage.setItem("user", "");
            },

            page(path = "") {
                this.$router.replace(path);
                this.title = this.$route.name;
                document.title = this.$route.name;
            },

            toFormData(obj) {
                const fd = new FormData();
                for (const x in obj) {
                    if (
                        typeof obj[x] === "object" &&
                        x !== "img" &&
                        x !== "copy"
                    ) {
                        for (const y in obj[x]) {
                            if (typeof obj[x][y] === "object") {
                                for (const z in obj[x][y]) {
                                    fd.append(`${x}[${y}][${z}]`, obj[x][y][z]);
                                }
                            } else {
                                fd.append(`${x}[${y}]`, obj[x][y]);
                            }
                        }
                    } else if (x !== "copy") {
                        fd.append(x, obj[x]);
                    }
                }
                return fd;
            },
        },
    };

    Vue.createApp(main)
        .component("Image", img)
        .component("Header", header)
        .component("toogle", toogle)
        .component("msg", msg)
        .component("popup", popup)
        .use(router)
        .mount("#content");
});
