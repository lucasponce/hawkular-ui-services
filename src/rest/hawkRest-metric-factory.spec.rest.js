describe('Provider: Hawkular live REST', function() {

  var HawkularMetric;
  var httpReal;

  var debug = false;
  var suffix = '-test-' + new Date().getTime();
  var tennantId = 'com.acme.sk' + suffix;
  var tennantId2 = 'com.acme.sk2' + suffix;
  var metricId = 'mymetric' + suffix;

  var arrayContainsField = function(array, field, value) {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      if (item.hasOwnProperty(field) && item[field] === value){
        return true;
      }
    }
    return false;
  }

  beforeEach(module('hawkular.services', 'httpReal', function(HawkularMetricProvider) {
    HawkularMetricProvider.setHost(__karma__.config.hostname);
    HawkularMetricProvider.setPort(__karma__.config.port);
  }));

  beforeEach(inject(function(_HawkularMetric_, _httpReal_) {
    HawkularMetric = _HawkularMetric_;
    httpReal = _httpReal_;
  }));

  describe('Tenants: ', function() {

    describe('creating a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: tennantId
        };

        debug && dump('creating tenant..', tenant);
        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying tenants..');
        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created tenant only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', tennantId)).toBe(true);
      });
    });

    describe('creating another tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var tenant = {
          id: tennantId2
        };

        debug && dump('creating tenant..', tenant);
        result = HawkularMetric.Tenant.save(tenant);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a tenant', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying tenants..');
        result = HawkularMetric.Tenant.query();
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get two previously created tenants', function() {
        expect(result.$resolved).toBe(true);
      });
    });
  });

  describe('Metrics: ', function() {

    /*
     Numeric
     */

    describe('creating a numeric metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          id: metricId
        };

        debug && dump('creating numeric metric..', metric);
        result = HawkularMetric.NumericMetric.save({ tenantId: tennantId }, metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a numeric metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('querying numeric metric..');
        result = HawkularMetric.Metric.queryNum({ tenantId: tennantId });
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously created tenant only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', metricId)).toBe(true);
      });
    });

    describe('creating a numeric data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": 2.1},
          {"timestamp": 1436857688195, "value": 2.2},
          {"timestamp": 1456857688195, "value": 2.3}
        ];

        debug && dump('creating numeric metric data..', data);
        result = HawkularMetric.NumericMetricData.save({ tenantId: tennantId, numericId: metricId }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple numeric metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "id": "appsrv1.request_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          },
          {
            "id": "appsrv1.response_time",
            "data": [
              {"timestamp": 1416857688195, "value": 2.1},
              {"timestamp": 1436857688195, "value": 2.2}
            ]
          }
        ];

        debug && dump('creating numeric metric multiple data..', data);
        result = HawkularMetric.NumericMetricMultiple.save({ tenantId: tennantId }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    /*
     Availability
     */

    describe('creating a availability metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var metric = {
          "id": "myavail",
          "tags": {
            "attribute1": "value1",
            "attribute2": "value2"
          }
        };

        debug && dump('creating availability metric..', metric);
        result = HawkularMetric.AvailabilityMetric.save({ tenantId: tennantId }, metric);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('getting a availability metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        debug && dump('qyerying availability metric..');
        result = HawkularMetric.Metric.queryAvail({ tenantId: tennantId });
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should get previously saved metric only', function() {
        expect(result.$resolved).toBe(true);
        expect(arrayContainsField(result, 'id', 'myavail')).toBe(true);
      });
    });

    describe('creating a availability data for single metric', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {"timestamp": 1416857688195, "value": "down"},
          {"timestamp": 1416857688195, "value": "up"}
        ];

        debug && dump('creating availability metric data..', data);
        result = HawkularMetric.AvailabilityMetricData.save({ tenantId: tennantId, availabilityId: 'myavail' }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

    describe('creating data for multiple availability metrics', function() {
      var result;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

      beforeEach(function(done) {

        var data = [
          {
            "id": "appsrv1",
            "data": [
              {"timestamp": 1416857688195, "value": "up"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          },
          {
            "id": "appsrv2",
            "data": [
              {"timestamp": 1416857688195, "value": "down"},
              {"timestamp": 1436857688195, "value": "up"}
            ]
          }
        ];

        debug && dump('creating availability metric multiple data..', data);
        result = HawkularMetric.AvailabilityMetricMultiple.save({ tenantId: tennantId }, data);
        httpReal.submit();

        result.$promise.then(function(){
        }, function(error){
          fail(errorFn(error));
        }).finally(function(){
          done();
        });
      });

      it('should resolve', function() {
        expect(result.$resolved).toEqual(true);
      });
    });

  });
});
