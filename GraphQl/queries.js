import { gql } from '@apollo/client'

const META = gql`
  query META {
    meta_namespace {
      id
      name
      type
      tags
      subjectareas {
        id
        name
        type
        ns_id
        tags
        entities {
          id
          name
          is_delta
          runtime
          description
          type
          subtype
        }
      }
    }
  }
`

const ENTITY = gql`
query meta_subjectarea($id: String!) {
  meta_subjectarea(id: $id) {
    id
    name
    entities {
      id
      name
      description
    }
  }
}
`

const ENTRIES = gql`
   query Meta_meta($entity: String!) {
    meta_meta (enid: $entity ) {
      id
      name
      type
      subtype
      nullable
      description
      alias
      default
      is_unique
      order
    }
  }
`

const DATAENTRIES = gql`
    query GetMeta($subjectarea: String!, $entity: String!) {
      meta_meta(where: { entity: { name: { _eq: $entity }, subjectarea: { name: { _eq: $subjectarea } } } }) {
        name
        type
      }
    }
  `

const RuleSet = gql`
  query MyQuery {
    function_help {
      category
        description
        example
        function
        id
        lang
        result
    }
  }
`
const MAPDETAILS = gql`
  query mapdetails($enId: String!) {
  meta_ruleset(targetEnId: $enId) {
    id
    name
    map {
      id
      name
    }
  }
}
`
const MappingData = gql`
query mapData($enId: String!, $type: String!) {
  meta_ruleset(targetEnId: $enId, type: $type) {
    id
    name
    map {
      id
      name
      map_source {
        source_entity {
          name
          id
          subjectarea {
            id
            name
            namespace {
              id
              name
            }
          }
        }
      }
      map_status
    }
  }
}
`

const MappingEntData = gql`
  query Meta_entity($entity: String!, $type: String!) {
    meta_entity(where: { name: { _eq: $entity }, type: { _eq: $type } }) {
        custom_props
        dependency
        description
        id
        is_delta
        name
        runtime
        sa_id
        subtype
        tags
        type
    }
}
`
const MappingSrcData = gql`
query map_src_data($mapId: String!) {
  map_ruleset(mapId: $mapId) {
    id
    name
    map {
      id
      name
      map_status
      type
    }
    rules {
      id
      language
      name
      rule_expression
      type
      subtype
      meta {
        id
        name
        subtype
        type
      }
    }
  }
}`

const DQRULES = gql`
  query dq_ruleset($enId: String!, $type: String) {
  meta_ruleset (targetEnId: $enId, type: $type) {
    id
    type
    name
    target_en_id
    view_name
    rules {
      id
      type
      subtype
      name
      alias
      rule_expression
      rule_status
      description
      is_shared
      language
      meta_id
      meta {
        id
        name
      }
    }
  }
}
`

const METANAME = gql`
query Meta_entity($enId: String!, $columnId: String!) {
  meta_entity(where: { id: { _eq: $enId } }) {
      id
      name
      meta(where: { name: { _eq: $columnId } }) {
          id
          name
      }
  }
}
`
const METARUNTIME = gql`
query Meta_entity($enId: String!) {
  meta_entity(where: { id: { _eq: $enId } }) {
      id
      name
      runtime
  }
}
`
const METAENTITYSEARCH = gql`
query Meta_namespace($search: String!) {
  meta_namespace(where: { type: { _eq: "glossary" } }) {
      id
      name
      type
      subjectareas {
          id
          name
          type
          entities(where: { name: { _ilike: $search } }) {
              description
              id
              name
              type
          }
      }
  }
}
`
const ENTITYSEARCHRESULT = gql`
query Meta_namespace {
  meta_namespace {
      id
      name
      type
      subjectareas {
          id
          name
          type
          entities {
              description
              id
              name
              type
              metas {
                  description
                  id
                  is_unique
                  name
                  nullable
              }
          }
      }
  }
}
`
const METADETAILS = gql`
  query Meta_meta($id: String!) {
    meta_meta(where: { id: { _eq: $id } }) {
      alias
      default
      description
      id
      length
      name
      order
      subtype
      tags
      type
    }
  }`

const METADETAILSASSO = gql`
query Meta_glossary_association {
  meta_glossary_association{
      glossary_id
      id
      glossary_association_type {
          description
          id
          short_description
      }
      metum {
          description
          glossary_associations {
              associated_id
              association_type_code
          }
      }
  }
}
`

export { META, ENTITY, ENTRIES, DATAENTRIES, RuleSet, MappingData, MappingEntData, MappingSrcData, DQRULES, METANAME, METARUNTIME, ENTITYSEARCHRESULT, METAENTITYSEARCH, METADETAILS, METADETAILSASSO, MAPDETAILS }
