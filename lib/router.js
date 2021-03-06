/* ---------------------------------------------------- +/

## Client-Server Router ##

Client-Server-side Router.

/+ ---------------------------------------------------- */

// Config
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});


/* Controllers */

Router.route('/', {
    name: 'home',
    waitOn: function() {
        array_subs = [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('activeBanners'),
            Meteor.subscribe('basicTipiDicts'),
            Meteor.subscribe('allSlugsInTipiDicts'),
            Meteor.subscribe('allDeputyNames')
        ]
        return array_subs;
    },
    data: function() {
        return {
            title: ''
        }
    }
});

Router.route('estadisticas', {
    name: 'stats',
    title: 'Las estadísticas',
    waitOn: function() {
        array_subs = [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('basicTipiDicts')
        ]
        return array_subs;
    },
    data: function() {
        return {
            title: 'Las estadísticas'
        }
    }
});

Router.route('api-doc', { 
    name: 'apidoc',
    title: 'Documentación de nuestra API',
    waitOn:function() {
        return Meteor.subscribe('allSlugsInTipiDicts');

    },
    data: function () {
        return {
            title: 'Documentación de la API',
            dicts: Dicts.find(),
        }
    }
});


Router.route('acerca', {
    name: 'about',
    title: 'Acerca de TIPI',
    data: function() {
        return {
            title: 'Acerca de TIPI'
        }
    }
});

Router.route('cookies', { 
    name: 'cookies',
    title: 'Uso de cookies',
    data: function() {
        return {
            title: 'Uso de cookies'
        }
    }
});

Router.route('privacy-policy', { 
    name: 'privacy-policy',
    title: 'Política de privacidad',
    data: function() {
        return {
            title: 'Política de privacidad'
        }
    }
});

Router.route('uso-de-csv', { 
    name: 'csv',
    title: 'CSV: cómo usarlo',
    data: function() {
        return {
            title: 'CSV: cómo usarlo'
        }
    }
});

Router.route('/que-paso-con', {
    name: 'quepasocon',
    title: 'Qué paso con...',
    data: function() {
        return {
            title: 'Qué paso con...'
        }
    }
});

Router.route('/escaner/', {
    name: 'search',
    title: 'Escáner',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('search', qry);
        var cqry = _.clone(qry);
        subs = [
            Meteor.subscribe("allTipiDictsWithTerms"),
            Meteor.subscribe('allGroups'),
            Meteor.subscribe("allDeputyNames")
        ];
        if (_.keys(qry).length > 0) {
            subs.push(Meteor.subscribe("allTipisSearch", builderQuery(cqry)));
        }
        return subs;
    },
    data: function () {
        var cnt = Iniciativas.find().count();
        return {
            title: 'Escáner',
            count: cnt,
            yesfound: cnt > 0,
            searched: _.keys(this.params.query).length > 0,
            tipisfound: Iniciativas.find({}, {sort: {fecha: -1}})
        }
    }
});

Router.route('/tipis/:_id', {
    name: 'tipi',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleTipi', generateId(this.params._id)),
            Meteor.subscribe('relatedTipis', generateId(this.params._id)),
            Meteor.subscribe('allDeputies'),
            Meteor.subscribe('allGroups')
        ];
    },
    data: function () {
        var id = this.params._id;
        return {
            title: 'Iniciativa',
            tipi: Iniciativas.findOne({"_id": generateId(id)}),
            related: _.toArray(_.filter(Iniciativas.find().fetch(), function(obj) { return obj._id._str !== id; }))
        }
    }
});

Router.route('/temas', {
    name: 'dicts',
    title: 'Temas',
    waitOn: function () {
        return Meteor.subscribe("allTipiDictsWithDesc");
    },
    data: function () {
        return {
            title: 'Temas',
            dicts: Dicts.find({}, {sort: {'name': 1}})
        }
    }
});

Router.route('/temas/:slug', {
    name: 'dict',
    title: '', //It will be assigned into view
    waitOn: function () {
        subs = [
            Meteor.subscribe('singleTipiDictBySlug', this.params.slug),
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('allDeputies'),
            Meteor.subscribe('allGroups')
        ];
        if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
            subs.push(Meteor.subscribe('exportUsers'));
        } 
        return subs;
    },
    data: function() {
        return {
            title: 'Tema',
            dict: Dicts.findOne()
        }
    }
});

Router.route('/dips/:_id', {
    name: 'deputy',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleDeputyById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByDeputy', generateId(this.params._id)),
            Meteor.subscribe('allGroups')
        ];
    },
    data: function() {
        return {
            title: 'Diputado/a',
            deputy: Diputados.findOne(),
            tipis: Iniciativas.find()
        }
    }
});

Router.route('/grupos/:_id', {
    name: 'group',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleGroupById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByGroup', generateId(this.params._id))
        ];
    },
    data: function() {
        return {
            title: 'Grupo Parlamentario',
            group: Grupos.findOne(),
            tipis: Iniciativas.find()
        }
    }
});


Router.route('/login', {
    name: 'login',
    title: 'Acceso',
    data: function() {
        return {
            title: 'Acceso'
        }
    },
});

Router.route('/signup', {
    name: 'signup',
    title: 'Registro',
    data: function() {
        return {
            title: 'Registro'
        }
    }
});

Router.route('/forgot', {
    name: 'forgot',
    title: '¿Olvidó su contraseña?',
    data: function() {
        return {
            title: '¿Olvidó su contraseña?'
        }
    },
});

Router.route('/perfil', {
    name: 'profile',
    template: 'profile_edit',
    title: 'Tu perfil',
    waitOn: function () {
        return Meteor.subscribe('allTipiDicts');
    },
    data: function() {
        return {
            title: 'Tu perfil'
        }
    }
});

Router.route('faq', { 
    name: 'faq',
    title: 'FAQ',
    data: function() {
        return {
            title: 'FAQ'
        }
    }
});

Router.route('medios', { 
    name: 'pressnews',
    title: 'Apariciones en medios',
    waitOn: function() {
        return Meteor.subscribe('news');
    },
    data: function() {
        return {
            title: 'Apariciones en medios',
        }
    }
});

// Permission functions

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

var goToProfile = function() {
  if (Meteor.user()) {
    Router.go('profile');
  } else {
    this.next();
  }
};

var hideCollapsedMenu = function() {
    $('#main-menu').collapse('hide');
    this.next();
}

// Router permissions

Router.onBeforeAction(requireLogin, {only: ['profile']});
Router.onBeforeAction(goToProfile, {only: ['login', 'signup', 'forgot']});
Router.onBeforeAction(hideCollapsedMenu, {only: ['search', 'dicts', 'about',  'profile', 'login', 'signup']});

// Clean old messages

Router.onBeforeAction(function() {
    Messages.remove({});
    this.next();
});

Router.after(function() {
    title = 'TiPi: Transparencia, Información, Participación, Incidencia';
    if (this.route.options.title)
        title = this.route.options.title + ' | ' + title;
    document.title = title;
});
