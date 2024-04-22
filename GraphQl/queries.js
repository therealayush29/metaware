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
    meta_subjectarea(where: { id: { _eq: $id } }) {
      id
      name
      entities {
        id
        name
        description
      }
      namespace {
        name
    }
    }
  }
`

const ENTRIES = gql`
query Meta_meta($name: String!, $subjectarea: String!, $type: String!, $namespace: String!,) {
  meta_meta(
      where: {
          entity: {
              name: { _eq: $name }
              subjectarea: {
                  name: { _eq: $subjectarea }
                  namespace: { type: { _eq: $type }, name: { _eq: $namespace } }
              }
          }
      }
  ) {
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

const MappingData = gql`
query MyQuery {
  meta_map {
    id
    map_status
    name
    type
    _created_when
    map_sources {
      entity {
        id
        name
        subjectarea {
          name
          namespace {
            name
          }
        }
      }
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
query Meta_ruleset($mapId: String!) {
  meta_ruleset(where: { map_id: { _eq: $mapId } }) {
      id
      ruleset_rules {
          id
          meta_id
          metum {
              name
          }
          rule {
              id
              language
              name
              rule_category
              rule_expression
          }
          ruleset {
              view_name
          }
      }
      entity {
        entityNaturalKeysByTargetEnId {
          source_natural_key
           target_meta_id
          source_natural_key_order
        }
      id
      }
  }
}`

const DQRULES = gql`
query Meta_ruleset_rules($enId: String!) {
  meta_ruleset_rules(
      where: { ruleset: { target_en_id: { _eq: $enId } } }
  ) {
      id
      meta_id
      rule_id
      ruleset_id
      rule {
          color
          description
          fn_name
          id
          is_shared
          language
          name
          rule_category
          rule_expression
          rule_status
          rule_tags
          subtype
          type
      }
  }
}`

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
export { META, ENTITY, ENTRIES, DATAENTRIES, RuleSet, MappingData, MappingEntData, MappingSrcData, DQRULES, METANAME, METARUNTIME }
