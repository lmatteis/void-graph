var jsonld = {
  "@graph" : [ {
    "@id" : "DBLP",
    "@type" : "void:Dataset",
    "subject" : [ "http://dbpedia.org/resource/Proceedings", "http://dbpedia.org/resource/Journal", "http://dbpedia.org/resource/Computer_science" ],
    "homepage" : "http://www4.wiwiss.fu-berlin.de/dblp/all"
  }, 
  {
    "@id" : "DBpedia",
    "@type" : "void:Dataset",
    "homepage" : "http://dbpedia.org/"
  }, 
  {
    "@id" : "LinkedMDB",
    "@type" : "void:Dataset",
    "homepage" : "http://linkedmdb.org/"
  }, 
  {
    "@id" : "Bio2RDF",
    "@type" : "void:Dataset",
    "homepage" : "http://bio2rdf.org/"
  }, 
  {
    "@id" : "DBpedia2DBLP",
    "@type" : "void:Linkset",
    "target" : [ "DBLP", "DBpedia" ]
  }, 
  {
    "@id" : "Bio2RDF2DBLP",
    "@type" : "void:Linkset",
    "target" : [ "Bio2RDF", "DBpedia" ]
  }, 
  {
    "@id" : "DBLP2DBpedia",
    "@type" : "void:Linkset",
    "target" : [ "DBpedia", "DBLP" ]
  }, 
  {
    "@id" : "LinkedMDB_DBpedia",
    "@type" : "void:Linkset",
    "target" : [ "LinkedMDB", "DBpedia" ]
  } 
  ],
  "@context" : {
    "subset" : {
      "@id" : "http://rdfs.org/ns/void#subset",
      "@type" : "@id"
    },
    "homepage" : {
      "@id" : "http://xmlns.com/foaf/0.1/homepage",
      "@type" : "@id"
    },
    "subject" : {
      "@id" : "http://purl.org/dc/terms/subject",
      "@type" : "@id"
    },
    "target" : {
      "@id" : "http://rdfs.org/ns/void#target",
      "@type" : "@id"
    },
    "@base" : "http://example.com/",
    "rdfs" : "http://www.w3.org/2000/01/rdf-schema#",
    "foaf" : "http://xmlns.com/foaf/0.1/",
    "sd" : "http://www.w3.org/ns/sparql-service-description#",
    "xsd" : "http://www.w3.org/2001/XMLSchema#",
    "owl" : "http://www.w3.org/2002/07/owl#",
    "rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "void" : "http://rdfs.org/ns/void#",
    "wv" : "http://vocab.org/waiver/terms/norms",
    "dcterms" : "http://purl.org/dc/terms/"
  }
};

