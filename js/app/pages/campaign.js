export const campaign = {
    data: function () {
        return {
                parent: "",
                data: {},
                details: {},
                date: "",
                date2: "",
                q: "",
                sort: "",
                loader: 1,
                iChart: -1,
                id: 0,
                type: 0,
                all: true
            }
        },
            mounted: function() {
                this.parent = this.$parent.$parent;
                if (!this.parent.user) {
                    this.parent.logout();
                }
                this.get();
                this.GetFirstAndLastDate();
            },
        methods: {
            GetFirstAndLastDate: function () {
                var year = new Date().getFullYear();
                var month = new Date().getMonth();
                var firstDayOfMonth = new Date(year, month, 2);
                var lastDayOfMonth = new Date(year, month + 1, 1);
                this.date = firstDayOfMonth.toISOString().substring(0, 10);
                this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
            },
            get: function() {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                if (this.date != "") data.append('date', this.date);
                if (this.date2 != "") data.append('date2', this.date2);
                data.append('id', this.parent.$route.params.id);
                self.loader = 1;
                axios.post(this.parent.url + "/site/getBanners?auth=" + this.parent.user.auth, data).then(function (response) {
                    self.loader = 0;
                    self.data = response.data;
                    document.title = self.data.info.title;
                    if (self.iChart != -1) self.line(self.data.items[self.iChart]);
                }).catch(function (error) {
                    self.parent.logout();
                });
            },
            getDetails: function(bid = false, type = false) {
                this.details = {};
                if (bid) this.id = bid;
                if (type) this.type = type;
                if (this.id) bid = this.id;
                if (this.type) type = this.type;
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                if (this.date != "") data.append('date', this.date);
                if (this.date2 != "") data.append('date2', this.date2);
                if (this.q != "") data.append('q', this.q);
                if (this.sort != "") data.append('sort', this.sort);
                if (bid != "") data.append('bid', bid);
                if (type != "") data.append('type', type);
                self.loader = 1;
                axios.post(this.parent.url + "/site/getStatisticsDetails?auth=" + this.parent.user.auth, data).then(function (response) {
                    self.details = response.data;
                    self.loader = 0;
                }).catch(function (error) {
                    self.parent.logout();
                });
            },
            action: function() {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
                axios.post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth, data).then(function (response) {
                    self.$refs.new.active = 0;
                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
                    }
                    self.get();
                }).catch(function (error) {
                    console.log('errors: ', error);
                });
            },
            actionAd: function() {
                var self = this;
                self.parent.formData.copy = "";
                var data = self.parent.toFormData(self.parent.formData);
                data.append('campaign', this.parent.$route.params.id);
                axios.post(this.parent.url + "/site/actionBanner?auth=" + this.parent.user.auth, data).then(function (response) {
                    self.$refs.ad.active = 0;
                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated banner!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new banner!");
                    }
                    self.get();
                }).catch(function (error) {
                    console.log('errors: ', error);
                });
            },
            delAd: async function () {
                if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this banner?")) {
                    var self = this;
                    var data = self.parent.toFormData(self.parent.formData);
                    axios.post("/site/deleteBanner?auth=" + this.parent.user.auth, data).then(function (response) {
                        self.Srefs.header.$refs.msg.successFun("Successfully deleted banner!");
                        self.get();
                    }).catch(function (error) {
                        console.log('errors: ', error);
                    });
                }
            },
            line: function (item) {
                setTimeout(function () {
                    let dates = [];
                    let clicks = [];
                    let views = [];
                    let leads = [];
                    if (item && item['line']) {
                        for (let i in item['line']) {
                            dates.push(i);
                            //if(item[i].include=='true') { 
                            clicks.push(item['line'][i].clicks);
                            views.push(item['line'][i].views);
                            leads.push(item['line'][i].leads);
                            //}
                        }
                    }
                    //console.log(clicks,views); 
                    document.getElementById('chartOuter').innerHTML = '<div id="chartHints" class="chart-hints"><p class="chartHintsViews">Views</p><p class="chartHintsClicks">Clicks</p></div><canvas id="myChart"></canvas>';
                    const ctx = document.getElementById('myChart');
                    const xScaleImage = {
                        id: "xScaleImage",
                        afterDatasetsDraw(chart, args, plugins) {
                            const { ctx, data, chartArea: { bottom }, scales: { x } } = chart;
                            ctx.save();
                            data.images.forEach((image, index) => {
                                const label = new Image();
                                label.src = image;

                                const width = 120;
                                ctx.drawImage(label, x.getPixelForValue(index) - (width / 2), x.top, width, width);
                            });
                        }
                    }
                    new Chart(ctx, {
                        type: 'line',

                        data: {
                            labels: dates,
                            datasets: [
                                {
                                    label: "Clicks",
                                    backgroundColor: "#00599D",
                                    borderColor: "#00599D",
                                    data: clicks
                                },
                                {
                                    label: "Views",
                                    backgroundColor: "#5000B8",
                                    borderColor: "#5000B8",
                                    data: views,
                                    yAxisID: 'y2'
                                },
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                tooltrip: {
                                    bodyFontSize: 20,
                                    usePointStyle: true,
                                    callbacks: {
                                        title: (ctx) => {
                                            return ctx[0]['dataset'].label
                                        },
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            categoryPercentage: 0.2,
                            barPercentage: 0.8,
                            scales: {
                                y: {
                                    id: 'y2',
                                    position: 'right'
                                },
                                x: {
                                    afterFit: (scale) => {
                                        scale.height = 120;
                                    }
                                }
                            }
                        },
                    });
                }, 100);
            },
            checkAll: function (prop) {
                if (this.data.items[this.iChart].sites) {
                    for (let i in this.data.items[this.iChart].sites) {
                        this.data.items[this.iChart].sites[i].include = prop;
                    }
                }
                this.parent.formData = this.data.items[this.iChart];
                this.get();
            }
        },
        tempalate:``


    };