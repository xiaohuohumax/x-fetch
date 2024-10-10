// URI Template
// https://datatracker.ietf.org/doc/html/rfc6570

export interface RFC6570TestCase {
  url: string
  params: Record<string, any>
  expected: string
}

export const rfc6570TestCases: RFC6570TestCase[] = [
  // |-----------------------------------------------------------------|
  // |  +  | Reserved string expansion                     (Sec 3.2.3) |
  // |     |                                                           |
  // |     |    {+var}                value                            |
  // |     |    {+hello}              Hello%20World!                   |
  // |     |    {+path}/here          /foo/bar/here                    |
  // |     |    here?ref={+path}      here?ref=/foo/bar                |
  {
    url: "{+var}",
    params: { var: "value" },
    expected: "value",
  },
  {
    url: "{+hello}",
    params: { hello: "Hello World!" },
    expected: "Hello%20World!",
  },
  {
    url: "{+path}/here",
    params: { path: "/foo/bar" },
    expected: "/foo/bar/here",
  },
  {
    url: "here?ref={+path}",
    params: { path: "/foo/bar" },
    expected: "here?ref=/foo/bar",
  },

  // |  #  | Fragment expansion, crosshatch-prefixed       (Sec 3.2.4) |
  // |     |                                                           |
  // |     |    X{#var}               X#value                          |
  // |     |    X{#hello}             X#Hello%20World!                 |
  {
    url: "X{#var}",
    params: { var: "value" },
    expected: "X#value",
  },
  {
    url: "X{#hello}",
    params: { hello: "Hello World!" },
    expected: "X#Hello%20World!",
  },

  // |     | String expansion with multiple variables      (Sec 3.2.2) |
  // |     |                                                           |
  // |     |    map?{x,y}             map?1024,768                     |
  // |     |    {x,hello,y}           1024,Hello%20World%21,768        |
  {
    url: "map?{x,y}",
    params: { x: 1024, y: 768 },
    expected: "map?1024,768",
  },
  {
    url: "{x,hello,y}",
    params: { x: 1024, hello: "Hello World!", y: 768 },
    expected: "1024,Hello%20World%21,768",
  },

  // |  +  | Reserved expansion with multiple variables    (Sec 3.2.3) |
  // |     |                                                           |
  // |     |    {+x,hello,y}          1024,Hello%20World!,768          |
  // |     |    {+path,x}/here        /foo/bar,1024/here               |
  {
    url: "{+x,hello,y}",
    params: { x: 1024, hello: "Hello World!", y: 768 },
    expected: "1024,Hello%20World!,768",
  },
  {
    url: "{+path,x}/here",
    params: { path: "/foo/bar", x: 1024 },
    expected: "/foo/bar,1024/here",
  },

  // |  #  | Fragment expansion with multiple variables    (Sec 3.2.4) |
  // |     |                                                           |
  // |     |    {#x,hello,y}          #1024,Hello%20World!,768         |
  // |     |    {#path,x}/here        #/foo/bar,1024/here              |
  {
    url: "{#x,hello,y}",
    params: { x: 1024, hello: "Hello World!", y: 768 },
    expected: "#1024,Hello%20World!,768",
  },
  {
    url: "{#path,x}/here",
    params: { path: "/foo/bar", x: 1024 },
    expected: "#/foo/bar,1024/here",
  },

  // |  .  | Label expansion, dot-prefixed                 (Sec 3.2.5) |
  // |     |                                                           |
  // |     |    X{.var}               X.value                          |
  // |     |    X{.x,y}               X.1024.768                       |
  {
    url: "X{.var}",
    params: { var: "value" },
    expected: "X.value",
  },
  {
    url: "X{.x,y}",
    params: { x: 1024, y: 768 },
    expected: "X.1024.768",
  },

  // |  /  | Path segments, slash-prefixed                 (Sec 3.2.6) |
  // |     |                                                           |
  // |     |    {/var}                /value                           |
  // |     |    {/var,x}/here         /value/1024/here                 |
  {
    url: "{/var}",
    params: { var: "value" },
    expected: "/value",
  },
  {
    url: "{/var,x}/here",
    params: { var: "value", x: 1024 },
    expected: "/value/1024/here",
  },

  // |  ;  | Path-style parameters, semicolon-prefixed     (Sec 3.2.7) |
  // |     |                                                           |
  // |     |    {;x,y}                ;x=1024;y=768                    |
  // |     |    {;x,y,empty}          ;x=1024;y=768;empty              |
  {
    url: "{;x,y}",
    params: { x: 1024, y: 768 },
    expected: ";x=1024;y=768",
  },
  {
    url: "{;x,y,empty}",
    params: { x: 1024, y: 768, empty: "" },
    expected: ";x=1024;y=768;empty",
  },

  // |  ?  | Form-style query, ampersand-separated         (Sec 3.2.8) |
  // |     |                                                           |
  // |     |    {?x,y}                ?x=1024&y=768                    |
  // |     |    {?x,y,empty}          ?x=1024&y=768&empty=             |
  {
    url: "{?x,y}",
    params: { x: 1024, y: 768 },
    expected: "?x=1024&y=768",
  },
  {
    url: "{?x,y,empty}",
    params: { x: 1024, y: 768, empty: "" },
    expected: "?x=1024&y=768&empty=",
  },

  // |  &  | Form-style query continuation                 (Sec 3.2.9) |
  // |     |                                                           |
  // |     |    ?fixed=yes{&x}        ?fixed=yes&x=1024                |
  // |     |    {&x,y,empty}          &x=1024&y=768&empty=             |
  {
    url: "?fixed=yes{&x}",
    params: { x: 1024 },
    expected: "?fixed=yes&x=1024",
  },
  {
    url: "{&x,y,empty}",
    params: { x: 1024, y: 768, empty: "" },
    expected: "&x=1024&y=768&empty=",
  },

  // |     | String expansion with value modifiers         (Sec 3.2.2) |
  // |     |                                                           |
  // |     |    {var:3}               val                              |
  // |     |    {var:30}              value                            |
  // |     |    {list}                red,green,blue                   |
  // |     |    {list*}               red,green,blue                   |
  // |     |    {keys}                semi,%3B,dot,.,comma,%2C         |
  // |     |    {keys*}               semi=%3B,dot=.,comma=%2C         |
  {
    url: "{var:3}",
    params: { var: "value" },
    expected: "val",
  },
  {
    url: "{var:30}",
    params: { var: "value" },
    expected: "value",
  },
  {
    url: "{list}",
    params: { list: ["red", "green", "blue"] },
    expected: "red,green,blue",
  },
  {
    url: "{list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "red,green,blue",
  },
  {
    url: "{keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "{keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "semi=%3B,dot=.,comma=%2C",
  },

  // |  +  | Reserved expansion with value modifiers       (Sec 3.2.3) |
  // |     |                                                           |
  // |     |    {+path:6}/here        /foo/b/here                      |
  // |     |    {+list}               red,green,blue                   |
  // |     |    {+list*}              red,green,blue                   |
  // |     |    {+keys}               semi,;,dot,.,comma,,             |
  // |     |    {+keys*}              semi=;,dot=.,comma=,             |
  {
    url: "{+path:6}/here",
    params: { path: "/foo/bar" },
    expected: "/foo/b/here",
  },
  {
    url: "{+list}",
    params: { list: ["red", "green", "blue"] },
    expected: "red,green,blue",
  },
  {
    url: "{+list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "red,green,blue",
  },
  {
    url: "{+keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "semi,;,dot,.,comma,,",
  },
  {
    url: "{+keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "semi=;,dot=.,comma=,",
  },

  // |  #  | Fragment expansion with value modifiers       (Sec 3.2.4) |
  // |     |                                                           |
  // |     |    {#path:6}/here        #/foo/b/here                     |
  // |     |    {#list}               #red,green,blue                  |
  // |     |    {#list*}              #red,green,blue                  |
  // |     |    {#keys}               #semi,;,dot,.,comma,,            |
  // |     |    {#keys*}              #semi=;,dot=.,comma=,            |
  {
    url: "{#path:6}/here",
    params: { path: "/foo/bar" },
    expected: "#/foo/b/here",
  },
  {
    url: "{#list}",
    params: { list: ["red", "green", "blue"] },
    expected: "#red,green,blue",
  },
  {
    url: "{#list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "#red,green,blue",
  },
  {
    url: "{#keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "#semi,;,dot,.,comma,,",
  },
  {
    url: "{#keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "#semi=;,dot=.,comma=,",
  },

  // |  .  | Label expansion, dot-prefixed                 (Sec 3.2.5) |
  // |     |                                                           |
  // |     |    X{.var:3}             X.val                            |
  // |     |    X{.list}              X.red, green, blue               |
  // |     |    X{.list*}             X.red.green.blue                 |
  // |     |    X{.keys}              X.semi,%3B,dot,.,comma,%2C       |
  // |     |    X{.keys*}             X.semi=%3B.dot=..comma=%2C       |
  {
    url: "X{.var:3}",
    params: { var: "value" },
    expected: "X.val",
  },
  {
    url: "X{.list}",
    params: { list: ["red", "green", "blue"] },
    expected: "X.red,green,blue",
  },
  {
    url: "X{.list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "X.red.green.blue",
  },
  {
    url: "X{.keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "X.semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "X{.keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "X.semi=%3B.dot=..comma=%2C",
  },

  // |  /  | Path segments, slash-prefixed                 (Sec 3.2.6) |
  // |     |                                                           |
  // |     |    {/var:1,var}          /v/value                         |
  // |     |    {/list}               /red,green,blue                  |
  // |     |    {/list*}              /red/green/blue                  |
  // |     |    {/list*,path:4}       /red/green/blue/%2Ffoo           |
  // |     |    {/keys}               /semi,%3B,dot,.,comma,%2C        |
  // |     |    {/keys*}              /semi=%3B/dot=./comma=%2C        |
  {
    url: "{/var:1,var}",
    params: { var: "value" },
    expected: "/v/value",
  },
  {
    url: "{/list}",
    params: { list: ["red", "green", "blue"] },
    expected: "/red,green,blue",
  },
  {
    url: "{/list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "/red/green/blue",
  },
  {
    url: "{/list*,path:4}",
    params: { list: ["red", "green", "blue"], path: "/foo" },
    expected: "/red/green/blue/%2Ffoo",
  },
  {
    url: "{/keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "/semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "{/keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "/semi=%3B/dot=./comma=%2C",
  },

  // |  ;  | Path-style parameters, semicolon-prefixed     (Sec 3.2.7) |
  // |     |                                                           |
  // |     |    {;hello:5}            ;hello=Hello                     |
  // |     |    {;list}               ;list=red,green,blue             |
  // |     |    {;list*}              ;list=red;list=green;list=blue   |
  // |     |    {;keys}               ;keys=semi,%3B,dot,.,comma,%2C   |
  // |     |    {;keys*}              ;semi=%3B;dot=.;comma=%2C        |
  {
    url: "{;hello:5}",
    params: { hello: "Hello World!" },
    expected: ";hello=Hello",
  },
  {
    url: "{;list}",
    params: { list: ["red", "green", "blue"] },
    expected: ";list=red,green,blue",
  },
  {
    url: "{;list*}",
    params: { list: ["red", "green", "blue"] },
    expected: ";list=red;list=green;list=blue",
  },
  {
    url: "{;keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: ";keys=semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "{;keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: ";semi=%3B;dot=.;comma=%2C",
  },

  // |  ?  | Form-style query, ampersand-separated         (Sec 3.2.8) |
  // |     |                                                           |
  // |     |    {?var:3}              ?var=val                         |
  // |     |    {?list}               ?list=red,green,blue             |
  // |     |    {?list*}              ?list=red&list=green&list=blue   |
  // |     |    {?keys}               ?keys=semi,%3B,dot,.,comma,%2C   |
  // |     |    {?keys*}              ?semi=%3B&dot=.&comma=%2C        |
  {
    url: "{?var:3}",
    params: { var: "value" },
    expected: "?var=val",
  },
  {
    url: "{?list}",
    params: { list: ["red", "green", "blue"] },
    expected: "?list=red,green,blue",
  },
  {
    url: "{?list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "?list=red&list=green&list=blue",
  },
  {
    url: "{?keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "?keys=semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "{?keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "?semi=%3B&dot=.&comma=%2C",
  },

  // |  &  | Form-style query continuation                 (Sec 3.2.9) |
  // |     |                                                           |
  // |     |    {&var:3}              &var=val                         |
  // |     |    {&list}               &list=red,green,blue             |
  // |     |    {&list*}              &list=red&list=green&list=blue   |
  // |     |    {&keys}               &keys=semi,%3B,dot,.,comma,%2C   |
  // |     |    {&keys*}              &semi=%3B&dot=.&comma=%2C        |
  {
    url: "{&var:3}",
    params: { var: "value" },
    expected: "&var=val",
  },
  {
    url: "{&list}",
    params: { list: ["red", "green", "blue"] },
    expected: "&list=red,green,blue",
  },
  {
    url: "{&list*}",
    params: { list: ["red", "green", "blue"] },
    expected: "&list=red&list=green&list=blue",
  },
  {
    url: "{&keys}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "&keys=semi,%3B,dot,.,comma,%2C",
  },
  {
    url: "{&keys*}",
    params: { keys: { semi: ";", dot: ".", comma: "," } },
    expected: "&semi=%3B&dot=.&comma=%2C",
  },
]
